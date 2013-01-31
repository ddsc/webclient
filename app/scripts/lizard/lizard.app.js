var filtercollectionview = new Lizard.views.FilterCollection();
var locationcollectionview = new Lizard.views.LocationCollection();
var parametercollectionview = new Lizard.views.ParameterCollection();

// Instantiate the Application()
Lizard.App = new Backbone.Marionette.Application();

// Add regions for Lizards main interface (menu + content)
Lizard.App.addRegions({
  content: '#content',
  menu: '#menu'
});

// Start Backbone's url router
Lizard.App.on('initialize:after', function() {
  Backbone.history.start();
});
