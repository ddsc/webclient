Example = {};

Example.App = new Backbone.Marionette.Application();

Example.App.addRegions({
	content: '#content',
	menu: '#menu'
});

Example.App.on('initialize:after', function(){
	Backbone.history.start();
});
