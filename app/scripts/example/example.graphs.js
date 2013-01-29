Example.Graphs = {};

Example.Graphs.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#graphs-template',
  regions: {
    'collageList': '#collageList',
    'selectedCollage': '#selectedCollage',
  }
});

Example.Graphs.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'graphs': 'graphs'
    }
});

Example.views = {};
Example.views.Collage = Backbone.Marionette.ItemView.extend({
	tagName: 'li',
	template: '#name-template'
});

Example.views.CollageList = Backbone.Marionette.CollectionView.extend({
	itemView: Example.views.Collage
});

collage = new Lizard.collections.Collage();

collageList = new Example.views.CollageList({
	collection: collage
});
collage.fetch();

Example.Graphs.graphs = function(){
	console.log('Example.Graphs.graphs()');

	// Instantiate Graphs's default layout
	var graphsView = new Example.Graphs.DefaultLayout();
	Example.App.content.show(graphsView);
	graphsView.collageList.show(
		collageList.render()
	);


  // And set URL to #graphs
  Backbone.history.navigate('graphs');
};

Example.App.addInitializer(function(){
  Example.Graphs.router = new Example.Graphs.Router({
    controller: Example.Graphs
  });

  Example.App.vent.trigger('routing:started');
});
