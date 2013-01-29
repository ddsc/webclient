/**
Collections
*/

Lizard.Collections = {};

Lizard.Collections.FilterCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('FilterCollection initializing');
  },
  url: local_settings.filters_url,
  model: Lizard.Models.FilterModel
});

Lizard.Collections.LocationCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('LocationCollection initializing');
  },
  url: local_settings.locations_url,
  model: Lizard.Models.LocationModel,
  parse: function(res, xhr) {
    return res.results;
  }
});

Lizard.Collections.ParameterCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('ParameterCollection initializing');
  },
  url: local_settings.parameters_url,
  model: Lizard.Models.ParameterModel
});

Lizard.Collections.Collage = Backbone.Collection.extend();