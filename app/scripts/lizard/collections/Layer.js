/* MAP COLLECTIONS */
Lizard.Collections.Layer = Backbone.Collection.extend({
  url: settings.layers_url,
  model: Lizard.geo.Layers.WMSLayer,
  updateOrderFieldOfItems: function() {
    index=0;
    this.each(function(workspaceItem) {
      workspaceItem.set('order',index);
      index = index + 1;
    });
  },
  fetch: function (cbs) {

    // DDSC only shows wmsLayers
    var wmsLayers = [];

    var convertLayer = function (layer) {
      if (layer.format === 'WMS') {
        layer.layer_name = layer.slug;
        layer.display_name = lg.name;
        layer.wms_url = layer.url;
        layer.styles = layer.options.styles;
        layer.type = layer.format.toLowerCase();
        layer.format = 'image/png';
        layer.height = '256';
        layer.width = '256';
        layer.options = {
          "buffer": 0,
          "isBaseLayer": false,
          "opacity": 1
        };
        layer.transparant = true;
        layer.description = '';
        layer.metadata = layer.meta;
        layer.opacity = lg.opacity;
        wmsLayers.push(layer);
      }
    };

    // Get layergroups from lizard-bs
    for (var key in window.data_layers) {
      var lg = window.data_layers[key];
      // translate layers to DDSC layers
      lg.layers.forEach(convertLayer);
    }

    // set these layers on the model
    this.set(wmsLayers);

    // call the succes callback with ddsc layers
    cbs.success(wmsLayers);

  }

});
