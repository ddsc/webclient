Lizard.Map = {};

Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion',
    'collageRegion': '#collageRegion',
    'modal' : '#location-modal'
  }
});


Lizard.Map.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'map': 'map',
      'map/:lonlatzoom': 'map' // lonlatzoom is a commaseparated longitude/latitude/zoomlevel combination
    }
});

layerCollection = new Lizard.Collections.Layer({
});

var layerView = new Lizard.views.LayerList({
	collection: layerCollection
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



/*This monstrosity of a Marionette ItemView is a view that
 is initiated when a location on the map is clicked.

 When one clicks on a location, the Bootstrap modal
 (focused lightbox with info) function is called. This

 The focused block shows an overview of different timeseries.
 A click on one of the timeseries opens a graph.

 One view belongs to one location.
*/
Lizard.views.ModalGraph = Backbone.Marionette.ItemView.extend({
    // custom template rendering to improve speed
    // due to explicit variable passing.
    template: function(model){
      return _.template($('#location-modal-template').html(), {
        name: model.name,
        tseries: model.tseries,
      }, {variable: 'timeseries'});
    },
    series: [],
    code: null,
    events: {
      'click .timeserie': "getSeriesdata",
    },
    // One Timeserie has many Events. An Events list is only
    // loaded when it is explcitly chosen, with caching.
    getSeriesdata: function(clickedon){
      // Gets the element that is clicked and it's datasets
      var data_url = clickedon.target.dataset.url;
      this.code = clickedon.target.dataset.code;
      var EventCollection = Backbone.Collection.extend({
        url: data_url
      });
      // Timeserie has Events. Opens new collection
      // for that specific timeserie.
      ts_events = new EventCollection();
      // _.bind connects "this" to the makeChart
      // otherwise it loses it's scope.
      ts_events.fetch({async:false, cache: true,
        success: _.bind(this.makeChart, this)
      });
    },
    onBeforeRender: function(){
      timeseriesCollection.url = settings.timeseries_url + 
        '?location=' + this.model.attributes.uuid;
      timeseriesCollection.reset();
      timeseriesCollection.fetch({async:false});
      this.model.set({tseries: timeseriesCollection});
      ts = this.model.attributes.timeseries;
    },
    makeChart: function(collection, responses){
      ts_events = responses;
      this.series = [];
      numbers = [];
      for (var i in ts_events){
        var date = new Date(ts_events[i].datetime);
        yvalue = parseFloat(ts_events[i].value);
        var value = {x: date.getTime()/1000, y: yvalue};
        (value ? this.series.push(value) : 'nothing');
        numbers.push(yvalue);
      }
      numbers.sort();
      // Could not find a more elegant solution so far
      // Div needs to be empty, otherwise it stacks
      // many graphs.
      $('#chart-canvas').empty();
      var graph = new Rickshaw.Graph( {
      element: $('#chart-canvas')[0],
      renderer: 'line',
      min: numbers[0],
      max: numbers[numbers.length - 1],
      series: [
            {
              color: "#c05020",
              data: this.series,
              name: this.code
            },
          ]
        } );

      var y_ticks = new Rickshaw.Graph.Axis.Y( {
        graph: graph,
        orientation: 'left',
        // tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: $('chart-y-axis')[0],
      } );

      graph.render();
      var hoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph
      } );

      // var legend = new Rickshaw.Graph.Legend( {
      //   graph: graph,
      //   element: $('#legend')[0]

      // } );

      // var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
      //   graph: graph,
      //   legend: legend
      // } );

      var axes = new Rickshaw.Graph.Axis.Time( {
        graph: graph
      } );
      axes.render();

    }
});


// Utils for this item
Lizard.Utils.Map = {
    modalInfo: function (e){
          var marker = e.target;
          var model = marker.valueOf().options.bbModel;
          model.fetch({
            success: function(model, res){
              modalView = new Lizard.views.ModalGraph();
              modalView.model = model;
              Lizard.mapView.modal.show(modalView.render());
              $('#location-modal').modal();
            },
            error: function(){
              console.log('Something went horribly wrong');
            },
            cache: true
          });
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
          var x = 4.411944150924683 + (Math.random() / 500.0);
          var y = 52.22242675741608 + (Math.random() / 500.0);
          var point = [x,y];
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


// It is highly debatable if this should be a Marionette Itemview.
// The functionality now allows:
// * Location models are loaded and added to a Leaflet map.
// * The infobox is update on "hover"
// * The items and their cid's (a Backbone identifier) are added to
// a 'workspaceCollection' on click on a specific object.
Lizard.Map.LeafletView = Backbone.Marionette.ItemView.extend({
  initialize: function(options) {
    console.log('LeafletView');
    // (value ? this.series.push(value) : 'nothing');
    options.lon; //= (options.lon ? options.lon : 5.16082763671875);
    options.lat; //= (options.lat ? options.lat : 51.95442214470791);
    options.zoom; //= (options.zoom ? options.zoom : 7);
  },
  collection: locationCollection,
  bounds: new L.LatLngBounds(
              new L.LatLng(53.74, 3.2849),
              new L.LatLng(50.9584, 7.5147)
          ),
  cloudmade: L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Map data &copy;' }),
  mapCanvas: null,
  markers: null,
  modalInfo:Lizard.Utils.Map.modalInfo,
  updateInfo: Lizard.Utils.Map.updateInfo,
  onShow: function(){
    console.log(this.collection)
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    this.mapCanvas = L.map('map', { layers: [this.cloudmade], center: new L.LatLng(this.options.lat, this.options.lon), zoom: this.options.zoom});
    L.control.scale().addTo(this.mapCanvas);
    window.mapCanvas = this.mapCanvas;
    this.markers = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 200
    });
    // The collection is loaded and the scope "this" is bound to the
    // drawonMap function.
    var that = this;

    this.collection.fetch({
      success: _.bind(Lizard.Utils.Map.drawonMap, that),
      error:function(data, response){
        console.log('Error this'+ response.responseText);
      }
    });
    $('#modal').on('show', this.updateModal);
    this.mapCanvas.addLayer(this.markers);

    //add custom control, to show information on hover
    // taken from http://leafletjs.com/examples/choropleth.html
    // info = L.control();

    // info.onAdd = function (map) {
    //     this._div = L.DomUtil.create('div', 'infobox'); // create info div
    //     this.update();
    //     return this._div;
    // };

    // info.update = function (props) {
    //     this._div.innerHTML = '<h4>Datapunt</h4>' + (props ?
    //             '<b>' + props.name + '</b><br>' +
    //             'Punt: ' + props.code
    //             : 'Zweef over de punten');
    // };

    // info.addTo(this.mapCanvas);
    $('#map').css('height', $(window).height()-100);
  },
  template: '#leaflet-template'
});

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

  var collageView = new CollageView();
  var layersView = layerView;
  var leafletView;

  if(lonlatzoom) {
    leafletView = new Lizard.Map.LeafletView({
      lon: lonlatzoom.split(',')[0],
      lat: lonlatzoom.split(',')[1],
      zoom: lonlatzoom.split(',')[2]
    });
  } else {
    leafletView = new Lizard.Map.LeafletView({
      lon: 5.16082763671875,
      lat: 51.95442214470791,
      zoom: 7
    });
  }

  // And show them in their divs
  Lizard.mapView.sidebarRegion.show(layersView.render());
  Lizard.mapView.collageRegion.show(collageView.render());
  Lizard.mapView.leafletRegion.show(leafletView.render());

  layerCollection.fetch();

  $('.drawer-item').popover({
    html: true,
    template: '<div class="popover"><div class="arrow"></div><div class="popover-inner layersview-popover"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  });

  window.mapCanvas.zoomIn(); // <-- TODO: Plz fix this hack which triggers a redraw of Leaflet. A gray screen will show if omitted.


  var mapMove = function(e) {
    var c = window.mapCanvas.getCenter();
    var z = window.mapCanvas.getZoom();
    window.mapCanvas.setView(new L.LatLng(c.lat, c.lng), z);
    Backbone.history.navigate('map/' + [c.lng, c.lat, z].join(','));
  };

  window.mapCanvas.on('moveend', mapMove);

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
