// It is highly debatable if this should be a Marionette Itemview.
// The functionality now allows:
// * Location models are loaded and added to a Leaflet map.
// * The infobox is update on "hover"
// * The items and their cid's (a Backbone identifier) are added to
// a 'workspaceCollection' on click on a specific object.


Lizard.Views.Map = Backbone.Marionette.ItemView.extend({
  template: '#leaflet-template',
  workspace: null,
  mapCanvas: null,
  //set on initialisation
  //modalInfo:Lizard.Utils.Map.modalInfo,
  //updateInfo: Lizard.Utils.Map.updateInfo,
  initialize: function(options) {
    console.log('LeafletView');
    // (value ? this.series.push(value) : 'nothing');
    this.lon = options.lon; //= (options.lon ? options.lon : 5.16082763671875);
    this.lat = options.lat; //= (options.lat ? options.lat : 51.95442214470791);
    this.zoom = options.zoom; //= (options.zoom ? options.zoom : 7);
    this.workspace = options.workspace;
  },
  //background layer
  backgroundLayers: {
    Waterkaart: L.tileLayer.wms("http://test.deltaportaal.lizardsystem.nl/service/", {
      layers: 'deltaportaal',
      format: 'image/png',
      transparent: true,
      reuseTiles: true,
      attribution: "Dijkdata"
    }),
    OpenStreetMap: new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }),
    MapBox: new L.TileLayer('http://{s}.tiles.mapbox.com/v3/examples.map-2k9d7u0c/{z}/{x}/{y}.png', {
      attribution: 'MapBox'
    }),
    Terrain: new L.Google("TERRAIN", {detectRetina: true}),
    Satellite :new L.Google("SATELLITE", {detectRetina: true}),
    Hybrid :new L.Google("HYBRID", {detectRetina: true})
  },
  extraLayers: {
  },
  onShow: function(){
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    this.workspace = this.options.workspace;

    if (this.mapCanvas === null){
      this.makemapCanvas();
    } else {
        this.mapCanvas.zoomIn();
        this.mapCanvas.on('viewreset', this.fixzoom);
      }
  },
  fixzoom: function(e){
    this.mapCanvas.zoomOut(false);
    this.mapCanvas.off('viewreset', this.fixzoom);
    console.log('hai');
  },
  makemapCanvas: function (){
    this.mapCanvas = L.map('map', {
      layers: [this.backgroundLayers.Waterkaart],
      center: new L.LatLng(this.options.lat, this.options.lon),
      zoom: this.options.zoom
    });

    var drawnItems = new L.FeatureGroup();
    this.mapCanvas.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
      draw: {
        position: 'topleft',
        polygon: false,
        circle: false,
        rectangle: false,
        polyline: false,
        marker: {
          title: 'Annoteren op de kaart'
        }
      },
      edit: {
        featureGroup: drawnItems
      }
    });
    this.mapCanvas.addControl(drawControl);

    this.mapCanvas.on('draw:created', function (e) {
      var type = e.layerType,
        layer = e.layer;

      if (type === 'marker') {
        var popup = L.popup()
          .setContent('<div style="height:200px;">'+$('#leaflet-annotation-template').html()+'</div>');
        layer.bindPopup(popup);
      }

      drawnItems.addLayer(layer);
    });

    var fullScreen = new L.Control.FullScreen();
    this.mapCanvas.addControl(fullScreen);


    L.control.scale().addTo(this.mapCanvas);
    var legend = new Lizard.Views.MapLegend(this.workspace);
    this.mapCanvas.addControl(legend);


    this.layerSwitcher = L.control.layers(this.backgroundLayers, this.extraLayers).addTo(this.mapCanvas);

    $('#modal').on('show', this.updateModal); //todo: ref to modal
    $('#map').css('height', $(window).height()- $('.footer').height() - $('.navbar').height() - 100);


    var mapMove = function(e) {
      var c = this.mapCanvas.getCenter();
      var z = this.mapCanvas.getZoom();
      this.mapCanvas.setView(new L.LatLng(c.lat, c.lng), z);
      Backbone.history.navigate('map/' + [c.lng, c.lat, z].join(','));
    };

    this.mapCanvas.on('moveend', _.bind(mapMove, this));

    this.initWorkspace();
    this._initialEvents();

    this.mapCanvas.on('click', _.bind(this.onMapClick, this));
  },
  onMapClick: function(event) {
    var coords = event.latlng;
    var that = this;
    var layers = this.workspace.where({selected:true});

    if (layers.length < 1) {
      alert('selecteer eerst een kaartlaag');
    } else {
      var layer = layers[0].get('layer');
      layer.getFeatureInfo(event, this.mapCanvas, {}, function(data) {
        var content = layer.getPopupContent(data);
        if (content) {
          var popup = L.popup().setContent(content).setLatLng(coords);
          that.mapCanvas.openPopup(popup);
        }
      });
    }

  },
  initWorkspace: function() {
    var that = this;
    this.workspace.each(function(model) {
      that.addLayer(model);
    });
  },
  _initialEvents: function(){
    if (this.workspace){
      this.listenTo(this.workspace, "add", this.addLayer, this);
      this.listenTo(this.workspace, "remove", this.removeLayer, this);
      this.listenTo(this.workspace, "reset", this.resetWorkspace, this);
      this.listenTo(this.workspace, "change:visibility", this.changeVisibilityLayer, this);
      this.listenTo(this.workspace, "change:opacity", this.changeOpacityLayer, this);
      this.listenTo(this.workspace, "change:order", this.changeOrderOfLayer, this);
    }
  },
  //add layer from workspace to Map (if visible)
  addLayer: function(layerModel){
    if (layerModel.get('visibility')) {
      this.mapCanvas.addLayer(layerModel.get('layer').getLeafletLayer());
      layerModel.set('addedToMap', true);
      var extralayersmodel = layerCollection.where({display_name: layerModel.get('display_name')});
      extralayersmodel[0].set('addedToMap', true);
    }
  },
  //remove layer from Map
  removeLayer: function(layerModel) {
    this.mapCanvas.removeLayer(layerModel.get('layer').getLeafletLayer());
    layerModel.set('addedToMap', false);
    var extralayersmodel = layerCollection.where({display_name: layerModel.get('display_name')});
    extralayersmodel[0].set('addedToMap', false);
  },
  //remove all layers of workspace from map
  resetWorkspace: function(newModels, oldRef) {
    console.log('resetWorkspace');
    var that = this;
    console.log(oldRef);
    oldRef.previousModels.forEach(function(layerModel){
      if (layerModel.get('addedToMap')) {
        that.removeLayer(layerModel);
      }
    });

    this.workspace.each(function(layerModel){
      that.addLayer(layerModel);
    });
  },
  changeOpacityLayer: function(layerModel) {
    console.log('Changing opacity to', layerModel.get('opacity'));
    var layer = layerModel.get('layer').getLeafletLayer().setOpacity(layerModel.get('opacity'));
    return layer;
  },
  changeOrderOfLayer: function(layerModel) {
    var layer = layerModel.get('layer').getLeafletLayer().setZIndex(100 - layerModel.get('order'));
  },
  //set layer visibility
  changeVisibilityLayer: function(layerModel) {
    if (layerModel.get('visibility')) {
      this.addLayer(layerModel);
    } else {
      this.removeLayer(layerModel);
    }
  }
});
