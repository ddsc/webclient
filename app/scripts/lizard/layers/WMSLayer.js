
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
    proxyForWms: false,//todo: add support
    proxyForGetInfo: false,
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
  getLeafletLayer: function() {
    if (!this.leafletLayer) {
      this.leafletLayer = this._getNewLeafletLayer();
    }
    return this.leafletLayer;
  },
  _getNewLeafletLayer: function() {
    return L.tileLayer.wms(this.attributes.wms_url, {
      zIndex: 100 - this.attributes.order,
      layers: this.attributes.layer_name,
      format: this.attributes.format,
      transparent: this.attributes.transparent,
      opacity: this.attributes.opacity,
      attribution: 'DDSC'
    });
  },
  //Function for getting featureInfo of this layer
  //event: leaflet click event
  //map: leaflet map object
  //callback: function called after a successful fetch of data
  getFeatureInfo: function(event, map, callback) {//todo: tot hier gekomen
    var url = this._getFeatureInfoRequestUrl(event, map);
    if (this.proxyForGetInfo) {
      url = 'http://test.api.dijkdata.nl/api/v0/proxy/?' + $.param({url: url})
    }

    $.ajax({
      url: url,
      dataType: "html",
      type: "GET",
      //async: false,
      success: function(data) {
        callback(data);
      }
    });

  },
  _getFeatureInfoRequestUrl: function(event, map) {
    return 'todo';//todo
  }
});

//add type to type index
LAYER_CLASSES['wms'] = Lizard.Layers.WMSLayer