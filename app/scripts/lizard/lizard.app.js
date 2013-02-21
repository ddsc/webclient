// Initialization code needed to run before eerything


$.ajaxSetup({
	xhrFields: {
		withCredentials: true
	}
});


// Define Lizard namespace
Lizard = {};

// Instantiate the Application()
Lizard.App = new Backbone.Marionette.Application();

// Add regions for Lizards main interface (menu + content)
Lizard.App.addRegions({
  content: '#content',
  menu: '#menu-bar'
});

// Start Backbone's url router
Lizard.App.on('initialize:after', function() {
  Backbone.history.start();
});
