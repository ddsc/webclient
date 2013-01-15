Lizard.Map = {};

Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion'
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


Lizard.Map.LeafletView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('LeafletView.initialize()');
  },
  onDomRefresh: function() {
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    console.log('onDomRefresh()');

    var bounds = new L.LatLngBounds(new L.LatLng(53.74, 3.2849), new L.LatLng(50.9584, 7.5147));
    var cloudmade = L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Map data &copy;' });
    var map = L.map('map', { layers: [cloudmade], center: new L.LatLng(52.12, 5.2), zoom: 7, maxBounds: bounds});
    
    var markers = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 200
    });

    d3.csv('data/4pp.csv', function(postcodes) {
      for (var i = postcodes.length - 1; i >= 0; i--) {
        var pc = postcodes[i];
        console.log(pc);
        var title = pc.Woonplaats;
        
        var marker = new L.Marker(new L.LatLng(pc.Latitude, pc.Longitude), { title: title });
        marker.bindPopup(title);
        markers.addLayer(marker);
      }
    });

    map.addLayer(markers);


    $('#map').css('height', $(window).height()-100);
  },
  template: '#leaflet-template'
});



Lizard.Map.map = function(){
  console.log('Lizard.Map.map()');

  // Instantiate Map's default layout
  var mapView = new Lizard.Map.DefaultLayout();

  // And add it to the #content div
  Lizard.content.show(mapView);


  var layersView = new LayersCollectionView();
  var leafletView = new Lizard.Map.LeafletView();


  var tree = new TreeNodeCollection(filterTreeData);
  var treeView = new TreeRoot({
      collection: tree
  });
  treeView.on('render', function() {
    console.log("Rendering tree in mapview..");
    $('.jsTree').jstree('open_all');
  });
  // mapView.sidebarRegion.show(treeView);



  // And show them in their divs
  // mapView.sidebarRegion.show(iconsView.render());
  mapView.sidebarRegion.show(layersView.render());
  mapView.leafletRegion.show(leafletView.render());

  $('.drawer-item').popover({
    html: true,
    template: '<div class="popover"><div class="arrow"></div><div class="popover-inner layersview-popover"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  });



  // Then tell backbone to set the navigation to #map
  Backbone.history.navigate('map');
};




Lizard.addInitializer(function(){
  Lizard.Map.router = new Lizard.Map.Router({
    controller: Lizard.Map
  });
  Lizard.vent.trigger('routing:started');
});

