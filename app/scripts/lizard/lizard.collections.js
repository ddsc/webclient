/**
Collections
*/

Lizard.collections = {};

Lizard.collections.Filter = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Filter collection initializing');
  },
  parse: function(response){
    return response.results
  },
  url: settings.filters_url,
  model: Lizard.models.Filter
});

Lizard.collections.Location = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Location collection initializing');
  },
  parse: function(response){
    return response.results
  },
  url: settings.locations_url,
  model: Lizard.models.Location
});

Lizard.collections.Parameter = Backbone.Collection.extend({
  initialize: function() {
    console.log('Parameter initializing');
  },
  parse: function(response){
    return response.results
  },
  url: settings.parameters_url,
  model: Lizard.models.Parameter
});

Lizard.collections.Widget = Backbone.Collection.extend({
  initialize: function() {
    console.log('Widget collection initializing');
  },
  parse: function(response){
    return response.results
  },
//   localStorage: new Backbone.LocalStorage("ddsc-widgets"),
  model: Lizard.models.Widget
});

Lizard.collections.Collage = Backbone.Collection.extend();

Lizard.collections.Timeseries = Backbone.Collection.extend({
  parse: function(response){
    return response.results
  },
  url: settings.timeseries_url,
  model: Lizard.models.Timeserie
});