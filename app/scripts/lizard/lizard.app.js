

// Define Lizard namespace
Lizard = {};

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
