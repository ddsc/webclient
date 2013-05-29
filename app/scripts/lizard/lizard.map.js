// Create default layout, including regions
Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion',
    'modalitems' : '#location-modal-collapsables',
    'workspaceListRegion': '#workspaceListRegion',
    'workspaceRegion': '#workspaceRegion',
    'annotationsRegion' : '#annotationsRegion',
    'geocoderRegion' : '#geocoderRegion',
    'extraLayerRegion' : '#extramaplayers'
  }
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
window.mapCanvas = ((window.mapCanvas === undefined) ? null : window.mapCanvas);

// Instantiate the Leaflet Marionnette View.
// This way you can talk with Leaflet after initializing the map.
// To talk with the Leaflet instance talk to -->
// Lizard.Map.Leaflet.mapCanvas

Lizard.Map.map = function(lonlatzoom, workspacekey){
  console.log('Lizard.Map.map()');

  if (!lonlatzoom || lonlatzoom.split(',').length < 2) {
    if (account.get('initialZoom').split(',').length === 3){
      lonlatzoom = account.get('initialZoom');
    } else{
      lonlatzoom = '5.16082763671875,51.95442214470791,7';
    }
  }

  // Instantiate Map's default layout
  Lizard.mapView = new Lizard.Map.DefaultLayout();

  // And add it to the #content div
  Lizard.App.content.show(Lizard.mapView);

  Lizard.workspaceView = new Lizard.Views.ActiveWorkspace();
  extraLayersView = new Lizard.Views.LayerList({
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
    var selectWorkspace = function(collection) {
      workspace = collection.get(workspacekey);
      collection.each(function(worksp) {
        worksp.set('selected', false);
      });
      workspace.set('selected', true);
      workspace.trigger('select_workspace', workspace);
    };
    if (workspaceCollection.models.length > 0) {
      selectWorkspace(workspaceCollection);
    } else {
      workspaceCollection.once('sync', selectWorkspace);
    }
  }

  Lizard.mapView.leafletRegion.show(leafletView.render());

  Lizard.mapView.workspaceListRegion.show(workspaceListView.render());
  Lizard.mapView.workspaceRegion.show(Lizard.workspaceView.render());
  Lizard.mapView.extraLayerRegion.show(extraLayersView.render());

  var annotationsModelInstance = new Lizard.Models.Annotations();
  var annotationsView = new Lizard.Views.AnnotationsView({
    model: annotationsModelInstance,
    mapView: leafletView
  });
  Lizard.mapView.annotationsRegion.show(annotationsView.render());


  // Lizard.mapView.geocoderRegion.show(new Lizard.Views.GeocoderView());

  // Correct place for this?
  Lizard.Map.ddsc_layers = new Lizard.geo.Layers.DdscMarkerLayer({
    collection: locationCollection,
    map: leafletView
  });

  $('.sensor-layer-toggler').click(function(e) {
    var $icon = $(this).find('i');
    if ($icon.hasClass('icon-check-empty')) {
      $icon.addClass('icon-check').removeClass('icon-check-empty');
      Lizard.Map.ddsc_layers.addToMap();
    }
    else {
      $icon.addClass('icon-check-empty').removeClass('icon-check');
      Lizard.Map.ddsc_layers.removeFromMap();
    }
  });

  // Then tell backbone to set the navigation to #map
  if(lonlatzoom && workspacekey){
    Backbone.history.navigate('map/' + lonlatzoom + '/' + workspacekey);
  } else if (lonlatzoom) {
    Backbone.history.navigate('map/' + lonlatzoom);
  } else {
    Backbone.history.navigate('map');
  }

  Lizard.App.vent.on('mapPan', function(lonlatzoom){
      urlfragment = Backbone.history.fragment.split('/');
      if (urlfragment.length === 3){
        Backbone.history.navigate('map/' + lonlatzoom + '/' + urlfragment[2]);
      } else if (lonlatzoom) {
      Backbone.history.navigate('map/' + lonlatzoom);
      } else {
        Backbone.history.navigate('map');
      }
    });

    tour = new Tour({
      labels: {
          next: "Verder »",
          prev: "« Terug",
          end: "Einde uitleg"
      },
      useLocalStorage: false,
      backdrop: true
    });
    tour.addStep({
        element: "#leafletRegion",
        title: "Kaart",
        placement: "left",
        content: "Dit is de kaart. Hier ziet u de locaties van de sensoren. Door de sensor locaties te selecteren" +
          "krijgt u meer informatie. Via de knop rechtsboven in de kaart kunt u andere achtergrond kaarten " +
          "selecteren. Met de 'waterkaart' kunt u nog verder inzoomen."
    });
    tour.addStep({
        element: "#workspaceListRegion",
        title: "Kaarten",
        placement: "right",
        content: "Dit zijn voorgedefinieerde kaarten. Door een kaart te selecteren worden er direct een aantal" +
          "kaartlagen geselecteerd en zoomt de kaart vaak naar het gebied waar de kaart betrekking op heeft."
    });
    tour.addStep({
        element: "#workspaceRegion",
        title: "Kaarten",
        placement: "right",
        content: "Dit zijn de geselecteerde kaartlagen. Door één van de kaartlagen te selecteren kan er extra" +
          "informatie over de objecten worden opgevraagd door een object van deze kaartlaag te selecteren op de kaart."+
          "Door rechts op de pijl de drukken kan de doorzicht van de kaartlaag worden gekozen en de " +
          "kaartlaag worden verwijderd."
    });
    tour.addStep({
        element: "#extramaplayers-button",
        title: "Kaarten",
        placement: "right",
        content: "Met deze knop wordt een overzicht getoond van extra kaartlagen die toegevoegd kunnen worden " +
          "aan de kaart. Hier zitten ook de kaartlagen voor alarmen en status/storingen bij."
    });
    tour.addStep({
        element: "#ddsc_temp",
        title: "DDSC kaartlagen",
        placement: "right",
        content: "Dit zijn twee specifieke kaartlagen voor het DDSC. De sensor locaties en de annotaties " +
          "(opmerkingen). Extra opmerkingen kunnen worden toegevoegd met de knop linksboven in de kaart of " +
          "via de popup bij sensor locaties."
    });
};

Lizard.App.addInitializer(function(){
  Lizard.Map.router = new Lizard.Map.Router({
    controller: Lizard.Map
  });
});
