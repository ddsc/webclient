// Create default layout, including regions
Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  events: {
    'click .sensor-layer-toggler': 'sensorsToggle',
    'click .alarm-toggler': 'alarmToggle',
    'click .status-toggler': 'statusToggle',
  },
  sensorsToggle: function (e) {
    var $icon = $(e.target).find('i');
    if ($icon.hasClass('icon-check-empty')) {
      $icon.addClass('icon-check').removeClass('icon-check-empty');
      Lizard.Map.ddsc_layers.addToMap();
    }
    else {
      $icon.addClass('icon-check-empty').removeClass('icon-check');
      Lizard.Map.ddsc_layers.removeFromMap();
    }
  },
  alarmToggle: function (e) {
    var $icon = $(e.target).find('i');
    if ($icon.hasClass('icon-check-empty')) {
      $icon.addClass('icon-check').removeClass('icon-check-empty');
      $('#status-region').removeClass('hidden');
      Lizard.alarmsCollection = new Backbone.Collection;
      alarmsView = new Lizard.Views.AlarmStatusView({
        collection: Lizard.alarmsCollection
      });
      alarmsView.collection.url = settings.alarms_url;
      alarmsView.collection.fetch();
      Lizard.mapView.alarmsRegion.show(alarmsView.render());
    } else {
      Lizard.mapView.alarmsRegion.close();
      $('#status-region').addClass('hidden');
      $icon.addClass('icon-check-empty').removeClass('icon-check');
    }
  },
  statusToggle: function (e) {
    var $icon = $(e.target).find('i');
    if ($icon.hasClass('icon-check-empty')) {
      $icon.addClass('icon-check').removeClass('icon-check-empty');
      $('#status-region').removeClass('hidden');
      Lizard.statusCollection = new Backbone.Collection;
      var statusView = new Lizard.Views.AlarmStatusView({
        collection: Lizard.statusCollection
      });
      statusView.collection.url = settings.status_url;
      statusView.collection.fetch();
      Lizard.mapView.statusRegion.show(statusView.render());
    } else {
      Lizard.mapView.statusRegion.close();
      $('#status-region').addClass('hidden');
      $icon.addClass('icon-check-empty').removeClass('icon-check');
    }
  },
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion',
    'modalitems' : '#location-modal-collapsables',
    'workspaceListRegion': '#workspaceListRegion',
    'workspaceRegion': '#workspaceRegion',
    'annotationsRegion' : '#annotations-region',
    'geocoderRegion' : '#geocoderRegion',
    'legendRegion': '#legendRegion',
    'extraLayerRegion' : '#extramaplayers',
    'fullScreenRegion': '#full-screen-region',
    'geoTiffRegion': '#geo-tiff-region',
    'alarmsRegion': '#alarms-region',
    'statusRegion': '#status-region'
  }
});

// Create router
Lizard.Map.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'map': 'map',
      'map/:lon,:lat,:zoom': 'map', // lonlatzoom is a commaseparated longitude/latitude/zoomlevel combination
      'map/:workspacekey': 'map' // workspace is a primary key that refers to a specific workspace
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

Lizard.Map.map = function(lon_or_workspacekey, lat, zoom) {
  console.log('Lizard.Map.map()');

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

  var legendListView = new Lizard.Views.LegendCollectionView({
    workspace: Lizard.workspaceView.getCollection()
  });
  window.legendlist = legendListView;

  var lon = null;
  if (lon_or_workspacekey && !lat && !zoom){
    var selectWorkspace = function(collection) {
      var workspaceItem = collection.get(lon_or_workspacekey);
      collection.each(function(workspaceItem2) {
        workspaceItem2.set('selected', false);
      });
      workspaceItem.set('selected', true);
      collection.trigger('select_workspace', workspaceItem);
    };
    if (workspaceCollection.models.length > 0) {
      selectWorkspace(workspaceCollection);
    } else {
      workspaceCollection.once('sync', selectWorkspace);
    }
  }
  else if (lon_or_workspacekey && lat && zoom) {
    lon = lon_or_workspacekey;
  }
  else {
      var accountZoom = account.get('initialZoom');
      if (accountZoom && accountZoom.split(',').length === 3) {
        lon = accountZoom.split(',')[0];
        lat = accountZoom.split(',')[1];
        zoom = accountZoom.split(',')[2];
      }
  }

  var leafletView = new Lizard.Views.Map({
    lon: lon,
    lat: lat,
    zoom: zoom,
    workspace: Lizard.workspaceView.getCollection()
  });

  Lizard.mapView.leafletRegion.show(leafletView.render());

  Lizard.mapView.workspaceListRegion.show(workspaceListView.render());
  Lizard.mapView.workspaceRegion.show(Lizard.workspaceView.render());
  Lizard.mapView.extraLayerRegion.show(extraLayersView.render());

  Lizard.mapView.legendRegion.show(legendListView.render());

  var annotationsModelInstance = new Lizard.Models.Annotations();
  var annotationsView = new Lizard.Views.AnnotationsView({
    model: annotationsModelInstance,
    mapView: leafletView
  });
  Lizard.mapView.annotationsRegion.show(annotationsView.render());

  // Lizard.mapView.statusRegion.show(statusView.render());


  var locationSearchCollection = new Lizard.Collections.LocationSearch;
  Lizard.mapView.geocoderRegion.show(new Lizard.Views.MapSearch({
    collection: locationSearchCollection
  }));

  // Correct place for this?
  Lizard.Map.ddsc_layers = new Lizard.geo.Layers.DdscMarkerLayer({
    collection: locationCollection,
    map: leafletView
  });
  // trigger for annotations layer.
  Lizard.App.vent.trigger('mapLoaded');


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
