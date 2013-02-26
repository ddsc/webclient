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


Lizard.Menu = {};
Lizard.Menu.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#menu-template',
  regions: {
	  'loginRegion': '#loginRegion'
  }
});


// Start Backbone's url router
Lizard.App.on('initialize:after', function() {
  menuView = new Lizard.Menu.DefaultLayout();
  loginView = new Lizard.Views.Menu();

  Lizard.App.menu.show(menuView);
  menuView.loginRegion.show(loginView.render());

  Backbone.history.start();
});
