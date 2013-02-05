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
      'map': 'map'
    }
});


// Model definitions

var Layer = Backbone.Model.extend({
  initialize: function() {
    console.log('LayerModel initializing');
  }
});

var layer1 = new Layer({
  id:1,
  layerName: 'AHN25',
  layerType: 'WMS',
  layerDescription: 'Actuele Hoogtekaart Nederland'
});

var layer2 = new Layer({
  id:2,
  layerName: 'Gemeentegrenzen (WMS)',
  layerType: 'WMS',
  layerDescription: 'Actuele Hoogtekaart Nederland'
});

var layer3 = new Layer({
  id:3,
  layerName: 'Waternet - Projecten - Amstel - 4.2.2. - Temperatuur',
  layerType: 'Interactive',
  layerDescription: 'Interactieve kaartlaag'
});

var layer4 = new Layer({
  id:4,
  layerName: 'HHNK - Dijken - 26.9 - Saturatie',
  layerType: 'Interactive',
  layerDescription: 'Interactieve kaartlaag'
});

var Layers = Backbone.Collection.extend();
var layerCollection = new Layers([layer1, layer2, layer3, layer4]);

Lizard.Map.LayersView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('LayersView.initialize()');
  },
  serializeData: function() {
    return {
      'title': 'Kaartlagen'
    };
  },
  template: '#layersview-template'
});


Lizard.Map.NoItemsView = Backbone.Marionette.ItemView.extend({
  template: '#show-no-items-message-template'
});


LayerItemView = Backbone.Marionette.ItemView.extend({
  template: '#layeritem-template',
  tagName: 'li',
  className: 'drawer-item',
  model: Layer,
  initialize: function() {
    console.log('LayerItemView() initializing');
  }
});

LayersCollectionView = Backbone.Marionette.CollectionView.extend({
  collection: layerCollection,
  itemView: LayerItemView,
  tagName: 'ol',
  className: 'ui-sortable drawer-group',
  onDomRefresh: function() {
    $('.drawer-group').sortable({
      'forcePlaceholderSize': true,
      'handle': '.handle',
      'axis': 'y'
    });
    $('.drawer-group').disableSelection();
  }
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


Lizard.views.ModalGraph = Backbone.Marionette.ItemView.extend({
    template: '#location-modal-template',
    onShow: function(){
      var chart;
      chart = new Highcharts.Chart({
                chart: {
                    renderTo:'chartarea',
                    type: 'line',
                },
                            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        this.x +': '+ this.y +'°C';
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        })
    }
})


// Utils for this item
Lizard.Utils.Map = {
    modalInfo: function (e){
          var marker = e.target;
          var model = marker.valueOf().options.bbModel;
          modalView = new Lizard.views.ModalGraph();
          modalView.model = model;
          Lizard.mapView.modal.show(modalView.render());
          $('#location-modal').modal();
    },
    updateModal: function(e){
        var marker = e.target;
        
    },
    updateInfo: function (e) {
        var marker = e.target;
        console.log(e);
        props = marker.valueOf().options;
        e.layer._map._controlContainer.innerHTML = '<h4>Datapunt</h4>' + (props ?
                '<b>' + props.name + '</b><br>' +
                'Punt: ' + props.code
                : 'Zweef over de punten');
    },
    // drawonMap takes the collection and goes through the models in it
    // 'drawing' them on the map.
    drawonMap: function(collection, objects){
        var models = collection.models;
        for (var i in models){
          var model = models[i];
          model.fetch({async: false});
          var attributes = model.attributes;
          var point = attributes.point_geometry;
          var marker = new L.Marker(new L.LatLng(point[1], point[0]),{
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
        wsitem.set({title: wsitem.attributes.name})
        Collage.add(wsitem);
    }
};


// It is highly debatable if this should be a Marionette Itemview.
// The functionality now allows:
// * Location models are loaded and added to a Leaflet map. 
// * The infobox is update on "hover"
// * The items and their cid's (a Backbone identifier) are added to
// a 'WorkspaceCollection' on click on a specific object.
Lizard.Map.LeafletView = Backbone.Marionette.ItemView.extend({
  collection: new Lizard.collections.Location(),
  bounds: new L.LatLngBounds(
              new L.LatLng(53.74, 3.2849), 
              new L.LatLng(50.9584, 7.5147)
          ),
  cloudmade: L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Map data &copy;' }),
  mapCanvas: null,
  markers: null,
  initialize: function(){
    console.log('LeafletView.initialize()');
  },
  modalInfo:Lizard.Utils.Map.modalInfo,
  updateInfo: Lizard.Utils.Map.updateInfo,
  onDomRefresh: function(){
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    this.mapCanvas = L.map('map', { layers: [this.cloudmade], center: new L.LatLng(52.12, 5.2), zoom: 7, maxBounds: this.bounds});
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
    info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'infobox'); // create info div
        this.update();
        return this._div;
    };

    info.update = function (props) {
        this._div.innerHTML = '<h4>Datapunt</h4>' + (props ?
                '<b>' + props.name + '</b><br>' +
                'Punt: ' + props.code
                : 'Zweef over de punten');
    };
    
    info.addTo(this.mapCanvas);
    $('#map').css('height', $(window).height()-100);
  },

  template: '#leaflet-template'
});

// Instantiate the Leaflet Marionnette View. 
// This way you can talk with Leaflet after initializing the map. 
// To talk with the Leaflet instance talk to -->
// Lizard.Map.Leaflet.mapCanvas

Lizard.Map.map = function(){
  console.log('Lizard.Map.map()');

  // Instantiate Map's default layout
  Lizard.mapView = new Lizard.Map.DefaultLayout();

  // And add it to the #content div
  Lizard.App.content.show(Lizard.mapView);

  var collageView = new CollageView();
  var layersView = new LayersCollectionView();
  Lizard.Map.Leaflet = new Lizard.Map.LeafletView();

  // And show them in their divs
  Lizard.mapView.sidebarRegion.show(layersView.render());
  Lizard.mapView.collageRegion.show(collageView.render());
  Lizard.mapView.leafletRegion.show(Lizard.Map.Leaflet.render());

  $('.drawer-item').popover({
    html: true,
    template: '<div class="popover"><div class="arrow"></div><div class="popover-inner layersview-popover"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  });

  // Then tell backbone to set the navigation to #map
  Backbone.history.navigate('map');
};

Lizard.App.addInitializer(function(){
  Lizard.Map.router = new Lizard.Map.Router({
    controller: Lizard.Map
  });
  Lizard.App.vent.trigger('routing:started');
});

