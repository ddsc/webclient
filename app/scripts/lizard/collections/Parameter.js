Lizard.Collections.Parameter = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Parameter initializing');
  },
  url: settings.parameters_url,
  model: Lizard.Models.Parameter
});