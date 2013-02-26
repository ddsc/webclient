Lizard.Map = {};

Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion',
    'collageRegion': '#collageRegion',
    'modalitems' : '#location-modal-collapsables',
    'favoriteRegion': '#favoriteRegion',
    // 'mapLayersRegion': '#mapLayersRegion',
    'layerRegion' : '#mapLayersRegion'
  },
  onShow: Lizard.Visualsearch.init
});


Lizard.Map.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'map': 'map',
      'map/:lonlatzoom': 'map' // lonlatzoom is a commaseparated longitude/latitude/zoomlevel combination
    }
});



Lizard.Map.NoItemsView = Backbone.Marionette.ItemView.extend({
  template: '#show-no-items-message-template'
});


Lizard.Map.IconItemView = Backbone.Marionette.ItemView.extend({
  template: '#icon-template',
  tagName: 'li'
});

Lizard.Map.IconCollectionView = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Map.IconItemView,
  emptyView: Lizard.Map.NoItemsView,
  tagName: 'ul',
  initialize: function() {
    console.log('IconCollectionView()', this);
  }
});


// Modal view that opens when clicking on a location
Lizard.Map.ModalTimeserieView = Backbone.Marionette.ItemView.extend({
  template:function(model){
    return _.template($('#location-modal-timeserie').html(), {
      name: model.name,
      uuid: model.url.split("eries/")[1].split("/")[0],
      events: model.events,
    }, {variable: 'timeserie'});
  },
  uuid: null,
  events: {
    'click .graph-this': "getSeriesdata",
    'click .fav': 'toggleFavorite',
  },
  tagName: 'li',
  onBeforeRender: function(view){

  },
  toggleFavorite: function(me) {
    var favorite = this.model.get('favorite');
    if(favorite) {
      this.model.set({"favorite": false});
      this.$el.find('i.icon-star').removeClass('icon-star').addClass('icon-star-empty');
    } else {
      this.model.set({"favorite": true});
      this.$el.find('i.icon-star-empty').removeClass('icon-star-empty').addClass('icon-star');
    }
    uuid = this.uuid;
    type = 'timeseries';
    Lizard.Utils.Favorites.toggleSelected(this.model);
  },
  // One Timeserie has many Events. An Events list is only
  // loaded when it is explcitly chosen, with caching.
  getSeriesdata: function(clickedon){
    // Gets the element that is clicked and it's datasets
    var data_url = clickedon.target.dataset.url;
    $('#modal-graph-wrapper').removeClass('hidden');
    $('#modal-graph-wrapper').find('.flot-graph').loadPlotData(data_url + '?eventsformat=flot');
  }
});

// Modal view that opens when clicking on a location
Lizard.Map.ModalTimeseriesView = Backbone.Marionette.CollectionView.extend({
  collection: timeseriesCollection,
  tagName: 'ul',
  itemView: Lizard.Map.ModalTimeserieView,
  onBeforeRender: function(){
    this.collection.url = settings.timeseries_url + 
      '?location=' + this.locationuuid;
  },
  onRender: function (model){
    $('#location-modal-label').html(this.location);
  }
});


// Utils for this item
Lizard.Utils.Map = {
    modalInfo: function (e){
          var marker = e.target;
          var model = marker.valueOf().options.bbModel;
          $('#modal-graph-wrapper').find('.flot-graph').empty();
          modalView = new Lizard.Map.ModalTimeseriesView();
          modalView.locationuuid = model.attributes.uuid;
          modalView.location = model.attributes.name;
          timeseriesCollection.reset();
          timeseriesCollection.fetch({cache: true});
          Lizard.mapView.modalitems.show(modalView.render());
          $('#location-modal').modal();
    },
    updateInfo: function (e) {
        var marker = e.target;
        console.log(e);
        // props = marker.valueOf().options;
        // e.layer._map._controlContainer.innerHTML = '<h4>Datapunt</h4>' + (props ?
        //         '<b>' + props.name + '</b><br>' +
        //         'Punt: ' + props.code
        //         : 'Zweef over de punten');
    },
    // drawonMap takes the collection and goes through the models in it
    // 'drawing' them on the map.
    drawonMap: function(collection, objects){
        var models = collection.models;
        for (var i in models){
          var model = models[i];
          var attributes = model.attributes;
          // var x = 4.411944150924683 + (Math.random() / 500.0);
          // var y = 52.22242675741608 + (Math.random() / 500.0);
          // var point = [x,y];
          var point = model.attributes.point_geometry;
          var leaflet_point = new L.LatLng(point[1], point[0]);
          var marker = new L.Marker(leaflet_point,{
            icon: L.icon({iconUrl: 'scripts/vendor/images/marker-dam-3.png'}),
            clickable: true,
            name: attributes.name,
            bbModel: model,
            code: attributes.code
          });
          //marker.on('mouseover', this.updateInfo);
          marker.on('click', Lizard.Utils.Map.modalInfo);
          this.markers.addLayer(marker);
    }},
    selectforCollage: function(e) {
        var marker = e.target;
        var properties = marker.valueOf().options;
        var wsitem = properties.bbModel;
        wsitem.set({title: wsitem.attributes.name});
        Collage.add(wsitem);
    }
};



// Instantiate the Leaflet Marionnette View.
// This way you can talk with Leaflet after initializing the map.
// To talk with the Leaflet instance talk to -->
// Lizard.Map.Leaflet.mapCanvas

Lizard.Map.map = function(lonlatzoom){
  console.log('Lizard.Map.map()');

  // Instantiate Map's default layout
  Lizard.mapView = new Lizard.Map.DefaultLayout();

  // And add it to the #content div
  Lizard.App.content.show(Lizard.mapView);
  var layersView = new Lizard.Views.LayerList();

  var leafletView;
  if(lonlatzoom) {
    leafletView = new Lizard.Views.Map({
      lon: lonlatzoom.split(',')[0],
      lat: lonlatzoom.split(',')[1],
      zoom: lonlatzoom.split(',')[2]
    });
  } else {
    leafletView = new Lizard.Views.Map({
      lon: 5.16082763671875,
      lat: 51.95442214470791,
      zoom: 7
    });
  }

  // And show them in their divs
  Lizard.mapView.favoriteRegion.show(favoritecollectionview.render());

  // Lizard.mapView.collageRegion.show(collageView.render());
  Lizard.mapView.leafletRegion.show(leafletView.render());
  Lizard.mapView.layerRegion.show(layersView.render());

  $('.drawer-item').popover({
    html: true,
    template: '<div class="popover"><div class="arrow"></div><div class="popover-inner layersview-popover"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  });



  // Then tell backbone to set the navigation to #map
  if(lonlatzoom) {
    Backbone.history.navigate('map/' + lonlatzoom);
  } else {
    Backbone.history.navigate('map/');
  }

};

Lizard.App.addInitializer(function(){
  Lizard.Map.router = new Lizard.Map.Router({
    controller: Lizard.Map
  });
  Lizard.App.vent.trigger('routing:started');
});
