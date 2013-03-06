// Create default layout, including regions
Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion',
    'modalitems' : '#location-modal-collapsables',
    'workspaceListRegion': '#workspaceListRegion',
    'workspaceRegion': '#workspaceRegion',
    'extraLayerRegion' : '#extraLayerRegion'
  },
  onShow: Lizard.Visualsearch.init
});

// Create router
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

// Create collection for this page
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


  var workspaceView = new Lizard.Views.ActiveWorkspace({
  });

  var workspaceListView = new Lizard.Views.WorkspaceCollection({
    collection: workspaceCollection,
    workspaceView: workspaceView
  });

  var extraLayersView = new Lizard.Views.LayerList({
    collection: layerCollection,
    workspace: workspaceView.collection
  });

  var leafletView;
  if(lonlatzoom) {
    leafletView = new Lizard.Views.Map({
      lon: lonlatzoom.split(',')[0],
      lat: lonlatzoom.split(',')[1],
      zoom: lonlatzoom.split(',')[2],
      workspace: workspaceView.collection
    });
  } else {
    leafletView = new Lizard.Views.Map({
      lon: 5.16082763671875,
      lat: 51.95442214470791,
      zoom: 7,
      workspace: workspaceView.collection
    });
  }

  Lizard.mapView.leafletRegion.show(leafletView.render());

  Lizard.mapView.workspaceListRegion.show(workspaceListView.render());
  Lizard.mapView.workspaceRegion.show(workspaceView.render());


  Lizard.mapView.extraLayerRegion.on('show', openTooltip);
  Lizard.mapView.extraLayerRegion.show(extraLayersView.render());

  function openTooltip(){
    console.log('wsfasdfasdf')
    $('#extraLayerRegion').popover();
    $('#extraLayerRegion').popover('toggle');
  }

  // Correct place for this?
  Lizard.Map.ddsc_layers = new Lizard.Layers.DdscMarkerLayer({
    collection: locationCollection,
    map: leafletView
  });

  // Then tell backbone to set the navigation to #map
  if(lonlatzoom) {
    Backbone.history.navigate('map/' + lonlatzoom);
  } else {
    Backbone.history.navigate('map');
  }

};

Lizard.App.addInitializer(function(){
  Lizard.Map.router = new Lizard.Map.Router({
    controller: Lizard.Map
  });
  Lizard.App.vent.trigger('routing:started');
});
