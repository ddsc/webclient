Lizard.Map = {};

Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion',
    'collageRegion': '#collageRegion'
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

// It is highly debatable if this should be a Marionnette Itemview.
// The functionality now allows:
// * Location models are loaded and added to a Leaflet map. 
// * The infobox is update on "hover"
// * The items and their cid's (a Backbone identifier) are added to
// a 'WorkspaceCollection' on click on a specific object.
Lizard.Map.LeafletView = Backbone.Marionette.ItemView.extend({
  collection: new Lizard.Collections.LocationCollection(),
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
  onDomRefresh: function() {
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    this.mapCanvas = L.map('map', { layers: [this.cloudmade], center: new L.LatLng(52.12, 5.2), zoom: 7, maxBounds: this.bounds});
    this.markers = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 200
    });
    // The collection is loaded and the scope "this" is bound to the 
    // drawonMap function.
    this.collection.fetch({success: _.bind(this.drawonMap, this)});
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
      marker.on('mouseover', updateInfo);
      marker.on('click', selectforCollage)
      this.markers.addLayer(marker);
    };
    this.mapCanvas.addLayer(this.markers);

    // Event listener for updating the information in the
    // upper right corner.
    // only works for L.Marker objects
    function updateInfo(e) {
        var marker = e.target;
        info.update(marker.valueOf().options);
    }
    
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


    function selectforCollage(e) {
        var marker = e.target;
        var properties = marker.valueOf().options;
        var wsitem = properties.bbModel;
        wsitem.set({title: wsitem.attributes.name})
        Collage.add(wsitem);
    };


    $('#map').css('height', $(window).height()-100);
  },
  template: '#leaflet-template'
});

// Instantiate the Leaflet Marionnette View. 
// This way you can talk with Leaflet after initializing the map. 
// To talk with the Leaflet instance talk to -->
// Lizard.Map.Leaflet.mapCanvas
Lizard.Map.Leaflet = new Lizard.Map.LeafletView();

Lizard.Map.map = function(){
  console.log('Lizard.Map.map()');

  // Instantiate Map's default layout
  var mapView = new Lizard.Map.DefaultLayout();

  // And add it to the #content div
  Lizard.App.content.show(mapView);


  var layersView = new LayersCollectionView();

  // And show them in their divs
  mapView.sidebarRegion.show(layersView.render());
  mapView.collageRegion.show(collageView.render());
  mapView.leafletRegion.show(Lizard.Map.Leaflet.render());

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

