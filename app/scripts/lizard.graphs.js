Lizard.Graphs = {};

Lizard.Graphs.DefaultView = Backbone.Marionette.ItemView.extend({
  template: '#graphs-template',
  className: 'graphs'
});

Lizard.Graphs.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'graphs': 'graphs'
    }
});

Lizard.Graphs.graphs = function(){
  console.log('Lizard.Graphs.graphs()');
  var graphView = new Lizard.Graphs.DefaultView();
  Lizard.content.show(graphView);
  Backbone.history.navigate('graphs');
};

Lizard.addInitializer(function(){
  Lizard.Graphs.router = new Lizard.Graphs.Router({
    controller: Lizard.Graphs
  });
  
  Lizard.vent.trigger('routing:started');
});