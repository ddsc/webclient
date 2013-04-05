/* WIDGET COLLECTIONS */
Lizard.Collections.Widget = Backbone.Collection.extend({
  initialize: function() {
    console.log('Widget collection initializing');
  },
  model: Lizard.Models.Widget
});