// Create default layout, including regions
Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion',
    'modalitems' : '#location-modal-collapsables',
    'workspaceListRegion': '#workspaceListRegion',
    'workspaceRegion': '#workspaceRegion',
    'extraLayerRegion' : '#extramaplayers'
  },
  onShow: Lizard.Visualsearch.init
});

// Create router
Lizard.Map.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'map': 'map',
      'map/:lonlatzoom': 'map', // lonlatzoom is a commaseparated longitude/latitude/zoomlevel combination
      'map/:lonlatzoom/:workspacekey': 'map' // workspace is a primary key that refers to a specific workspace
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
layerCollection = new Lizard.Collections.Layer();


// Instantiate the Leaflet Marionnette View.
// This way you can talk with Leaflet after initializing the map.
// To talk with the Leaflet instance talk to -->
// Lizard.Map.Leaflet.mapCanvas

Lizard.Map.map = function(lonlatzoom, workspacekey){
  console.log('Lizard.Map.map()');

  if (!lonlatzoom || lonlatzoom.length < 2) {
    lonlatzoom = '5.16082763671875,51.95442214470791,7'
  }

  // Instantiate Map's default layout
  Lizard.mapView = new Lizard.Map.DefaultLayout();

  // And add it to the #content div
  Lizard.App.content.show(Lizard.mapView);


  Lizard.workspaceView = new Lizard.Views.ActiveWorkspace();
  var extraLayersView = new Lizard.Views.LayerList({
    collection: layerCollection,
    workspace: Lizard.workspaceView.getCollection()
  });

  var workspaceListView = new Lizard.Views.WorkspaceCollection({
    collection: workspaceCollection,
    workspaceView: Lizard.workspaceView
  });

  var leafletView = new Lizard.Views.Map({
    lon: lonlatzoom.split(',')[0],
    lat: lonlatzoom.split(',')[1],
    zoom: lonlatzoom.split(',')[2],
    workspace: Lizard.workspaceView.getCollection()
  });


  if (workspacekey){
    workspaceCollection.listenTo(workspaceCollection, 'gotAll', function(collection){
      workspace = collection.get(workspacekey);
      collection.each(function(worksp) {
        worksp.set('selected', false);
      });
      workspace.set('selected', true);
      workspace.trigger('select_workspace', workspace);
    })
  }

  Lizard.mapView.leafletRegion.show(leafletView.render());

  Lizard.mapView.workspaceListRegion.show(workspaceListView.render());
  Lizard.mapView.workspaceRegion.show(Lizard.workspaceView.render());
  Lizard.mapView.extraLayerRegion.show(extraLayersView.render());

  // Correct place for this?
  Lizard.Map.ddsc_layers = new Lizard.Layers.DdscMarkerLayer({
    collection: locationCollection,
    map: leafletView
  });

  // Then tell backbone to set the navigation to #map
  if(lonlatzoom && workspacekey){
    Backbone.history.navigate('map/' + lonlatzoom + '/' + workspacekey);
  } else if (lonlatzoom) {
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
