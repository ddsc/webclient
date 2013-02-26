// Initialization code needed to run before eerything
$.ajaxSetup({
	xhrFields: {
		withCredentials: true
	}
});


// Define Lizard namespace
Lizard = {};
Lizard.Layers = {};
Lizard.Popups = {};

// Instantiate the Application()
Lizard.App = new Backbone.Marionette.Application();

// Add regions for Lizards main interface (menu + content)
Lizard.App.addRegions({
  content: '#content',
});


// Start Backbone's url router
Lizard.App.on('initialize:after', function() {
  var loginView = new Lizard.Views.Menu();
  loginView.render();

  Backbone.history.start();
});
