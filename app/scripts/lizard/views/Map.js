// It is highly debatable if this should be a Marionette Itemview.
// The functionality now allows:
// * Location models are loaded and added to a Leaflet map.
// * The infobox is update on "hover"
// * The items and their cid's (a Backbone identifier) are added to
// a 'workspaceCollection' on click on a specific object.
Lizard.Views.Map = Backbone.Marionette.ItemView.extend({
  template: '#leaflet-template',
  //collection: null,
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
  },
  deltaportaal: L.tileLayer.wms("http://test.deltaportaal.lizardsystem.nl/service/", {
    layers: 'deltaportaal',
    format: 'image/png',
    transparent: true,
    reuseTiles: true,
    attribution: "KAART B"
  }),
  //cloudmade: L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Map data &copy;' }),
  onShow: function(){
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    this.mapCanvas = L.map('map', { layers: [this.deltaportaal], center: new L.LatLng(this.options.lat, this.options.lon), zoom: this.options.zoom});
    L.control.scale().addTo(this.mapCanvas);
    //window.mapCanvas = this.mapCanvas;
    $('#modal').on('show', this.updateModal);
    $('#map').css('height', $(window).height()-100);

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
  }
});
