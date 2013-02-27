// Initialization code needed to run before eerything
$.ajaxSetup({
	xhrFields: {
		withCredentials: true
	}
});

Backbone.Collection.prototype.move = function(model, toIndex) {
  var fromIndex = this.indexOf(model)
  if (fromIndex == -1) {
    throw new Error("Can't move a model that's not in the collection")
  }
  if (fromIndex !== toIndex) {
    this.models.splice(toIndex, 0, this.models.splice(fromIndex, 1)[0]);
    this.trigger('sort', this);
  }
}

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
