Lizard.Map = {};

//create default layout, including regions
Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion',
    'collageRegion': '#collageRegion',
    'modalitems' : '#location-modal-collapsables',
    'favoriteRegion': '#favoriteRegion',
    'layerRegion' : '#mapLayersRegion'
  },
  onShow: Lizard.Visualsearch.init
});

//create router
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

// create collection for this page
workspaceCollection = new Lizard.Collections.Workspace();
layerCollection = new Lizard.Collections.Layer();


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

  var layersView = new Lizard.Views.LayerList({
    collection: layerCollection
  });

  var leafletView;
  if(lonlatzoom) {
    leafletView = new Lizard.Views.Map({
      lon: lonlatzoom.split(',')[0],
      lat: lonlatzoom.split(',')[1],
      zoom: lonlatzoom.split(',')[2],
      workspace: layerCollection
    });
  } else {
    leafletView = new Lizard.Views.Map({
      lon: 5.16082763671875,
      lat: 51.95442214470791,
      zoom: 7,
      workspace: layerCollection
    });
  }

  // And show them in their divs
  Lizard.mapView.favoriteRegion.show(favoritecollectionview.render());

  // Lizard.mapView.collageRegion.show(collageView.render());
  Lizard.mapView.leafletRegion.show(leafletView.render());
  Lizard.mapView.layerRegion.show(layersView.render());

  //correct place for this?
  Layers.DdscMarkerLayer({
    collection: locationCollection,
    map: leafletView.mapCanvas
  })

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
