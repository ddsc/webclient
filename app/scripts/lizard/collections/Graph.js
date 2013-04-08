/* GRAPH COLLECTIONS */
Lizard.Collections.Graph = Backbone.Collection.extend({
  url: settings.layers_url,
  model: Lizard.Models.Graph
});