/*
- Application-wide models, collections, views
- Application() instantiation (Marionette)
- Main Region definition
- Marionette/Backbone routing
*/


var FilterModel = Backbone.Model.extend({
  initialize: function() {
    console.log('FilterModel initializing');
  }
});

var LocationModel = Backbone.Model.extend({
  initialize: function() {
    console.log('LocationModel initializing');
  }
});

var ParameterModel = Backbone.Model.extend({
  initialize: function() {
    console.log('ParameterModel initializing');
  }
});

var FilterCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('FilterCollection initializing');
  },
  url: local_settings.filters_url,
  model: FilterModel
});

var LocationCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('LocationCollection initializing');
  },
  url: local_settings.locations_url,
  model: LocationModel
});

var ParameterCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('ParameterCollection initializing');
  },
  url: local_settings.parameters_url,
  model: ParameterModel
  // parse: function(res, xhr) {
  //   return res.results;
  // }
});



// Instantiate the Application()
Lizard = new Backbone.Marionette.Application();

// Add regions for Lizards main interface (menu + content)
Lizard.addRegions({
  content: '#content',
  menu: '#menu'
});

// Start Backbone's url router
Lizard.on('initialize:after', function() {
  Backbone.history.start();
});
