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

collage = new Lizard.collections.Collage();
collage.fetch();

Example.Graphs.graphs = function(){
  console.log('Example.Graphs.graphs()');

  // Instantiate Graphs's default layout
  var graphsView = new Example.Graphs.DefaultLayout();
  Example.App.content.show(graphsView);

  // And set URL to #graphs
  Backbone.history.navigate('graphs');
};

Example.App.addInitializer(function(){
  Example.Graphs.router = new Example.Graphs.Router({
    controller: Example.Graphs
  });

  Example.App.vent.trigger('routing:started');
});
