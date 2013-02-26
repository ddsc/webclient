// It is highly debatable if this should be a Marionette Itemview.
// The functionality now allows:
// * Location models are loaded and added to a Leaflet map.
// * The infobox is update on "hover"
// * The items and their cid's (a Backbone identifier) are added to
// a 'workspaceCollection' on click on a specific object.
Lizard.Views.Map = Backbone.Marionette.ItemView.extend({
  initialize: function(options) {
    console.log('LeafletView');
    // (value ? this.series.push(value) : 'nothing');
    options.lon; //= (options.lon ? options.lon : 5.16082763671875);
    options.lat; //= (options.lat ? options.lat : 51.95442214470791);
    options.zoom; //= (options.zoom ? options.zoom : 7);
  },
  collection: locationCollection,
  deltaportaal: L.tileLayer.wms("http://test.deltaportaal.lizardsystem.nl/service/", {
    layers: 'deltaportaal',
    format: 'image/png',
    transparent: true,
    reuseTiles: true,
    attribution: "KAART B"
  }),
  //cloudmade: L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Map data &copy;' }),
  mapCanvas: null,
  markers: null,
  modalInfo:Lizard.Utils.Map.modalInfo,
  updateInfo: Lizard.Utils.Map.updateInfo,
  onShow: function(){
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    this.mapCanvas = L.map('map', { layers: [this.deltaportaal], center: new L.LatLng(this.options.lat, this.options.lon), zoom: this.options.zoom});
    L.control.scale().addTo(this.mapCanvas);
    window.mapCanvas = this.mapCanvas;
    this.markers = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 200
    });
    // The collection is loaded and the scope "this" is bound to the
    // drawonMap function.
    var that = this;

    this.collection.fetch({
      success: _.bind(Lizard.Utils.Map.drawonMap, that),
      error:function(data, response){
        console.log('Error this'+ response.responseText);
      }
    });
    $('#modal').on('show', this.updateModal);
    this.mapCanvas.addLayer(this.markers);

    $('#map').css('height', $(window).height()-100);
  },
  template: '#leaflet-template'
});
