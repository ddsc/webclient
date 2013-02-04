Lizard.Map = {};

Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion',
    'workspaceRegion': '#workspaceRegion'
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

var WorkspaceItem = Backbone.Model.extend({
  initialize: function() {
  }
});

var WorkspaceItems = Backbone.Collection.extend();
var Workspace = new WorkspaceItems();
function addtoWorkspace(w) {
  Workspace.add(w);
  console.log(w.attributes.title + ' added to Workspace');
};

WorkspaceItemView = Backbone.Marionette.ItemView.extend({
  template: '#workspaceitem-template',
  tagName: 'li',
  className: 'drawer-item workspace-item',
  model: WorkspaceItem,
  events: {
    "click .remove" : "removeItem",
    "click .toggle" : "toggleItem",
  },
  removeItem: function() {
    this.model.destroy();
  },
  toggleItem: function() {
    console.log(this.model.attributes.title);
  }
})
;
WorkspaceView = Backbone.Marionette.CollectionView.extend({
  collection: Workspace,
  itemView: WorkspaceItemView,
  tagName:'ol',
  className: 'ui-sortable workspace-group drawer-group',
  initialize: function() {

  },
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

var LMarkerView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('LocationView.initialize()');
  },
});





var LMarkerCollectionView = Backbone.Marionette.CollectionView.extend({
  collection: new LocationCollection(),
  itemView: LMarkerView,
  initialize: function(){
      this.collection.fetch();
  }
});


Lizard.Map.LeafletView = Backbone.Marionette.ItemView.extend({
  bounds: new L.LatLngBounds(
              new L.LatLng(53.74, 3.2849),
              new L.LatLng(50.9584, 7.5147)
          ),
  cloudmade: L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', { maxZoom: 18, attributesrbution: 'Map data &copy;' }),
  mapCanvas: null,
  initialize: function(){
    console.log('LeafletView.initialize()' + this.bounds );
  },
  onDomRefresh: function() {
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    console.log('onDomRefresh()');

    this.mapCanvas = L.map('map', { layers: [this.cloudmade], center: new L.LatLng(52.12, 5.2), zoom: 7, maxBounds: this.bounds});

    var markers = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 200
    });

    d3.csv('data/4pp.csv', function(postcodes) {
      for (var i = postcodes.length - 1; i >= 0; i--) {
        var pc = postcodes[i];
        var title = pc.Woonplaats;

        var marker = new L.Marker(new L.LatLng(pc.Latitude, pc.Longitude), {
            clickable:true,
            title: title,
            provincie:pc.Provincie
        });
        // tell the marker what to do when hovering
        marker.on('mouseover', updateInfo);
        marker.on('click', selectforWorkspace);
        markers.addLayer(marker);
      }
    });

//    this.mapCanvas.addLayer(markers);



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
        this._div.innerHTML = '<h4>Postcode</h4>' + (props ?
                '<b>' + props.title + '</b><br>' +
                'Provincie: ' + props.provincie
                : 'Zweef over de punten');
    };

    info.addTo(this.mapCanvas);


    function selectforWorkspace(e) {
        var marker = e.target;
        var properties = marker.valueOf().options;
        var wsitem = new WorkspaceItem({
            title: properties.title,
            layerName: properties.title,
            layerType: properties.title
        });
        addtoWorkspace(wsitem);
    };


    $('#map').css('height', $(window).height()-100);
  },
  template: '#leaflet-template'
});

// Instantiate the Leaflet Marionnette View.
// This way you can talk with Leaflet after
// initializing the map.
// To talk with the Leaflet instance talk to -->
// Lizard.Map.Leaflet.mapCanvas
Lizard.Map.Leaflet = new Lizard.Map.LeafletView();

Lizard.Map.map = function(){
  console.log('Lizard.Map.map()');

  // Instantiate Map's default layout
  var mapView = new Lizard.Map.DefaultLayout();

  // And add it to the #content div
  Lizard.content.show(mapView);


  var layersView = new LayersCollectionView();
  var workspaceView = new WorkspaceView();


  // And show them in their divs
  mapView.sidebarRegion.show(layersView.render());
  mapView.workspaceRegion.show(workspaceView.render());
  mapView.leafletRegion.show(Lizard.Map.Leaflet.render());

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
