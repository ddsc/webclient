// Create default layout, including regions
Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  events: {
    'click .sensor': 'sensorsToggle',
    'click .alarms': 'alarmToggle',
    'click .status': 'statusToggle',
    'click .metrics-dropdown': 'toggleChevron',
    'click #extramaplayers-button': 'toggleExtraLayers',
    'click .icon-remove': 'closeGeoTiff'
  },
  onRender: function () {

    $('input[type=checkbox]').on('click', function(e) {
      var el = $(this);
      if(el.is(':checked')) {
        el.parent().css('font-weight', 'bold');
      } else {
        el.parent().css('font-weight', 'normal');
      }
      return true;
    });

  },
  closeGeoTiff: function () {
    Lizard.mapView.geoTiffRegion.close(); 
 },
  toggleChevron: function (e) {
    // Click handlers for toggling the filter/location/parameter UI
      e.preventDefault();
      $(e.target).find('.icon-chevron-down').toggleClass('chevron-oneeighty');
      var el = $(e.currentTarget).next();
      if(el.is(':visible')) {
        el.addClass('hide');
      } else {
        el.removeClass('hide');
      }
  },
  toggleExtraLayers: function (e) {
        e.preventDefault();
        $('#extramodal').modal();
  },
  sensorsToggle: function (e) {
    if (e.target.nodeName == "I") {
      var $icon = $(e.target);
    } else {
      var $icon = $(e.target).find('i');
    }
    if ($icon.hasClass('icon-check-empty')) {
      $icon.addClass('icon-check').removeClass('icon-check-empty');
      Lizard.Map.ddsc_layers.addToMap();
    } else {
      $icon.addClass('icon-check-empty').removeClass('icon-check');
      Lizard.Map.ddsc_layers.removeFromMap();
    }
  },
  alarmToggle: function (e) {
    if (e.target.nodeName == "I") {
      var $icon = $(e.target);
    } else {
      var $icon = $(e.target).find('i');
    }
    if (e.target.nodeName == "EM") {
      var $badge = $(e.target);
    } else {
      var $badge = $(e.target).find('.badge');
    }
    if ($icon.hasClass('icon-check-empty')) {
      $icon.addClass('icon-check').removeClass('icon-check-empty');
      $badge.removeClass('hidden');
      $('#alarms-region').removeClass('hidden');
      Lizard.alarmsCollection = new Backbone.Collection;
      alarmsView = new Lizard.Views.AlarmView({
        collection: Lizard.alarmsCollection
      });
      alarmsView.collection.url = settings.alarms_url;
      alarmsView.collection.fetch().done(function (collection){
        $badge.html(collection.models.length);
      });
      Lizard.mapView.alarmsRegion.show(alarmsView.render());
    } else {
      Lizard.mapView.alarmsRegion.close();
      $('#alarms-region').addClass('hidden');
      $badge.addClass('hidden');
      $icon.addClass('icon-check-empty').removeClass('icon-check');
    }
  },
  statusToggle: function (e) {
    if (e.target.nodeName == "I") {
      var $icon = $(e.target);
    } else {
      var $icon = $(e.target).find('i');
    }
    if (e.target.nodeName == "EM") {
      var $badge = $(e.target);
    } else {
      var $badge = $(e.target).find('.badge');
    }
    if ($icon.hasClass('icon-check-empty')) {
      $icon.addClass('icon-check').removeClass('icon-check-empty');
      $badge.removeClass('hidden');
      $('#status-region').removeClass('hidden');
      Lizard.statusCollection = new Backbone.Collection;
      var statusView = new Lizard.Views.StatusView({
        collection: Lizard.statusCollection
      });
      statusView.collection.url = settings.status_url;
      statusView.collection.fetch().done(function (collection){
        $badge.html(collection.models.length);
      });
      Lizard.mapView.statusRegion.show(statusView.render());
    } else {
      Lizard.mapView.statusRegion.close();
      $badge.addClass('hidden');
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
  },
  onClose: function () {
    if (window.mapFullScreen) {
      var fullScreenMap = document.getElementById('full-screen-map');
      if (fullScreenMap) {
        fullScreenMap.parentNode.removeChild(fullScreenMap);
        window.mapFullScreen = false;
      }
    }
  }
});

// Create router
Lizard.Map.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'map': 'map',
      'map/:lon,:lat,:zoom': 'map', // lonlatzoom is a commaseparated longitude/latitude/zoomlevel combination
      'map/:workspacekey': 'map', // workspace is a primary key that refers to a specific workspace
      'map/alarm': 'alarm', 
      'map/status': 'status' 
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

Lizard.Map.status = function () {
  Lizard.Map.map('status');
};

Lizard.Map.alarm = function () {
  Lizard.Map.map('alarm');
};

// Instantiate the Leaflet Marionnette View.
// This way you can talk with Leaflet after initializing the map.
// To talk with the Leaflet instance talk to -->
// Lizard.Map.Leaflet.mapCanvas

Lizard.Map.map = function(lon_or_workspacekey, lat, zoom) {

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
      if (lon_or_workspacekey == 'alarm') {
        $('.alarms').click();      
      } else if (lon_or_workspacekey == 'status') {
        $('.status').click();      
      } else {
        var workspaceItem = collection.get(lon_or_workspacekey);
        collection.each(function(workspaceItem2) {
          workspaceItem2.set('selected', false);
        });
        workspaceItem.set('selected', true);
        collection.trigger('select_workspace', workspaceItem);
      };
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

  if (lon_or_workspacekey == 'alarm' || lon_or_workspacekey == 'status') {
    $('li.annotation').click();
  } 
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
