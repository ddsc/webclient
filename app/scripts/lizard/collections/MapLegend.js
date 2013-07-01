/* MAP LEGEND COLLECTION */
Lizard.Collections.MapLegend = Backbone.Collection.extend({
  url: settings.layers_url,
  model: Lizard.geo.Layers.WMSLayer
});