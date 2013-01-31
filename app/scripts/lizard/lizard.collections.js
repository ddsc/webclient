/**
collections
*/

Lizard.collections = {};

Lizard.collections.Filter = Backbone.Collection.extend({
  initialize: function() {
    console.log('Filter initializing');
  },
  url: local_settings.filters_url,
  model: Lizard.models.Filter
});

Lizard.collections.Location = Backbone.Collection.extend({
  initialize: function() {
    console.log('Location initializing');
  },
  url: local_settings.locations_url,
  model: Lizard.models.Location,
  parse: function(res, xhr) {
    return res;
  }
});

Lizard.collections.Parameter = Backbone.Collection.extend({
  initialize: function() {
    console.log('Parameter initializing');
  },
  url: local_settings.parameters_url,
  model: Lizard.models.Parameter
});

Lizard.collections.Collage = Backbone.Collection.extend();