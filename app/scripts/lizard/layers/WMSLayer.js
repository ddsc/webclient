//  Class for WMS Layers
//
//
Lizard.Layers.WMSLayer = Lizard.Layers.MapLayer.extend({
  defaults: {
    display_name: '',
    visibility: false,
    opacity: 100,
    order: 0,
    //extra info and links
    description: null,
    metadata: null,
    legend_url: null,
    enable_search: null,
    //program settings
    type: null, //='wms'
    addedToMap: false,
    //specific settings for wms overlays
    layer_name: '',
    styles: null,
    format: 'image/png',
    height: null,
    width: null,
    tiled: null,
    transparent: true,
    wms_url: ''
  },
  getLeafletLayer: function(index) {
    if (!this.leafletLayer) {
      this.leafletLayer = L.tileLayer.wms(this.attributes.wms_url, {
        zIndex: 100 - index,
        layers: this.attributes.layer_name,
        format: this.attributes.format,
        transparent: this.attributes.transparent,
        opacity: this.attributes.opacity,
        attribution: 'DDSC'
      });
    }
    return this.leafletLayer;
  },
  getFeatureInfo: function() {
    //todo
  }
});