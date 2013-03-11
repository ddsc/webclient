
LAYER_CLASSES = {};

//  Base class for layers
//
//
Lizard.Layers.MapLayer = Backbone.Model.extend({
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
    addedToMap: false
  },
  getLeafletLayer: function() {
    return null;
  },
  getFeatureInfo: function() {
    return '-';
  }

});