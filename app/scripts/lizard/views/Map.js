// It is highly debatable if this should be a Marionette Itemview.
// The functionality now allows:
// * Location models are loaded and added to a Leaflet map.
// * The infobox is update on "hover"
// * The items and their cid's (a Backbone identifier) are added to
// a 'workspaceCollection' on click on a specific object.
Lizard.Views.Map = Backbone.Marionette.ItemView.extend({
  template: '#leaflet-template',
  workspace: null, //set on initialisation
  mapCanvas: null,
  //modalInfo:Lizard.Utils.Map.modalInfo,
  //updateInfo: Lizard.Utils.Map.updateInfo,
  initialize: function(options) {
    console.log('LeafletView');
    // (value ? this.series.push(value) : 'nothing');
    options.lon; //= (options.lon ? options.lon : 5.16082763671875);
    options.lat; //= (options.lat ? options.lat : 51.95442214470791);
    options.zoom; //= (options.zoom ? options.zoom : 7);
    this.workspace = options.workspace;
  },
  //background layer
  backgroundLayers: {
    waterkaart: L.tileLayer.wms("http://test.deltaportaal.lizardsystem.nl/service/", {
      layers: 'deltaportaal',
      format: 'image/png',
      transparent: true,
      reuseTiles: true,
      attribution: "Dijkdata"
    }),
    openstreetMap: new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    })
  },
  onShow: function(){
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    this.workspace = this.options.workspace;

    this.mapCanvas = L.map('map', {
      layers: [this.backgroundLayers.waterkaart],
      center: new L.LatLng(this.options.lat, this.options.lon),
      zoom: this.options.zoom
    });

    var fullScreen = new L.Control.FullScreen();
    this.mapCanvas.addControl(fullScreen);


    L.control.scale().addTo(this.mapCanvas);
    this.layerSwitcher = L.control.layers(this.backgroundLayers, {}).addTo(this.mapCanvas);

    $('#modal').on('show', this.updateModal); //todo: ref to modal
    $('#map').css('height', $(window).height()- $('.footer').height() - $('.navbar').height() - 100);

    var that = this;

    function fixzoom(e) {
      that.mapCanvas.zoomOut(false);
      that.mapCanvas.off('viewreset', fixzoom);
    }
    that.mapCanvas.zoomIn(); // <-- TODO: Plz fix this hack which triggers a redraw of Leaflet. A gray screen will show if omitted.
    that.mapCanvas.on('viewreset', fixzoom);

    // window.mapCanvas.invalidateSize()

    var mapMove = function(e) {
      var c = that.mapCanvas.getCenter();
      var z = that.mapCanvas.getZoom();
      that.mapCanvas.setView(new L.LatLng(c.lat, c.lng), z);
      Backbone.history.navigate('map/' + [c.lng, c.lat, z].join(','));
    };

    that.mapCanvas.on('moveend', mapMove);

    this.initWorkspace();
    this._initialEvents();

  },
  initWorkspace: function() {
    var that = this;
    this.workspace.each(function(model) {
      that.addLayer(model);
    });

  },
  //todo: bind to workspace
  _initialEvents: function(){
    if (this.workspace){
      this.listenTo(this.workspace, "add", this.addLayer, this);
      this.listenTo(this.workspace, "remove", this.removeLayer, this);
      this.listenTo(this.workspace, "reset", this.resetWorkspace, this);
      this.listenTo(this.workspace, "sort", this.sortWorkspace, this);
      this.listenTo(this.workspace, "change:visibility", this.changeVisibilityLayer, this);
      //this.listenTo(this.workspace, "sync", this.syncWorkspace, this);
    }
  },
  //add layer from workspace to Map (if visible)
  addLayer: function(layerModel){
    if (layerModel.get('visibility')) {
      var index = this.workspace.indexOf(layerModel);
      layer = layerModel.get('layer').getLeafletLayer();
      this.mapCanvas.addLayer(layer);
      layerModel.set('addedToMap', true);
    }
  },
  //remove layer from Map
  removeLayer: function(layerModel) {
    console.log('removeLayer');

    this.mapCanvas.removeLayer(layerModel.get('layer').getLeafletLayer());
    layerModel.set('addedToMap', false);
  },
  //remove all layers of workspace from map
  resetWorkspace: function(newModels, oldRef) {
    console.log('resetWorkspace');
    var that = this;

    oldRef.previousModels.forEach(function(layerModel){
      if (layerModel.get('addedToMap')) {
        that.removeLayer(layerModel);
      }
    });

    this.workspace.each(function(layerModel){
      that.addLayer(layerModel);
    });
  },
  //reorder layers
  sortWorkspace: function(e) {
    console.log('sortWorkspace - now  happens in Lizard.Views.ActiveWorkspace drop');
  },
  //set layer visibility
  changeVisibilityLayer: function(layerModel) {
    console.log('changeVisibilityLayer');

    if (layerModel.get('visibility')) {
      this.mapCanvas.addLayer(layerModel.get('layer').getLeafletLayer());
    } else {
      this.mapCanvas.removeLayer(layerModel.get('layer').getLeafletLayer());
    }
  },
  //add all layers after sync of workspace
  syncWorkspace: function() {
    console.log('syncWorkspace');

    var that = this;
    this.workspace.each(function(layerModel){
      if (!layerModel.get('addedToMap')) {
        that.addLayer(layerModel);
      }
    });
  }
});
