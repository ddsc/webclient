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
  }
});