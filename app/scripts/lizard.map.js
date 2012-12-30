// http://33.33.33.25:3000/api/v1/portals/50dd76c469380c5506000001/apps/

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


// Model definitions
Lizard.Map.Icon = Backbone.Model.extend();


// Collection definitions
Lizard.Map.IconCollection = Backbone.Collection.extend({
  model: Lizard.Map.Icon,
  url: 'http://33.33.33.25:3000/api/v1/portals/'
});






Lizard.Map.IconItemView = Backbone.Marionette.ItemView.extend({
  template: '#icon-template',
  tagName: 'li',
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

    $('#drawer-queue-group').sortable({forcePlaceholderSize: true});
    $('#drawer-queue-group').disableSelection();
  },
  template: '#leaflet-template'
});



Lizard.Map.map = function(){
  console.log('Lizard.Map.map()');

  // Instantiate Map's default layout
  var mapView = new Lizard.Map.DefaultLayout();

  // And add it to the #content div
  Lizard.content.show(mapView);


  var iconCollection = new Lizard.Map.IconCollection();
  var iconCollectionView = new Lizard.Map.IconCollectionView({
      collection: iconCollection
  });

  iconCollection.fetch({
    success: function() {
      mapView.sidebarRegion.show(iconCollectionView);
    }
  });

  // Instantiate the views we want to show
  // var iconsView = new Lizard.Map.IconsView();
  var layersView = new Lizard.Map.LayersView();
  var leafletView = new Lizard.Map.LeafletView();


  // And show them in their divs
  // mapView.sidebarRegion.show(iconsView.render());
  // mapView.sidebarRegion.show(layersView.render());
  mapView.leafletRegion.show(leafletView.render());

  // Then tell backbone to set the navigation to #map
  Backbone.history.navigate('map');
};




Lizard.addInitializer(function(){
  Lizard.Map.router = new Lizard.Map.Router({
    controller: Lizard.Map
  });
  Lizard.vent.trigger('routing:started');
});

