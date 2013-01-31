/**
collections
*/

Lizard.collections = {};

Lizard.collections.Filter = Backbone.Collection.extend({
  initialize: function() {
    console.log('Filter collection initializing');
  },
  url: local_settings.filters_url,
  model: Lizard.models.Filter,
  parse: function(res, xhr) {
    if(res.results) {
      return res.results;
    } else {
      return res;
    }
  }  
});

Lizard.collections.Location = Backbone.Collection.extend({
  initialize: function() {
    console.log('Location collection initializing');
  },
  url: local_settings.locations_url,
  model: Lizard.models.Location,
  parse: function(res, xhr) {
    if(res.results) {
      return res.results;
    } else {
      return res;
    }
  }
});

Lizard.collections.Parameter = Backbone.Collection.extend({
  initialize: function() {
    console.log('Parameter collection initializing');
  },
  url: local_settings.parameters_url,
  model: Lizard.models.Parameter,
  parse: function(res, xhr) {
    if(res.results) {
      return res.results;
    } else {
      return res;
    }
  }  
});

Lizard.collections.Collage = Backbone.Collection.extend();
