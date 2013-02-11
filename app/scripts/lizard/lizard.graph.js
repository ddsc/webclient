Lizard.Graphs = {};


Lizard.Graphs.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#graphs-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'mainRegion': '#mainRegion',
    'parametersRegion': 'p#parametersRegion',
    'filtersRegion': 'p#filtersRegion',
    'locationsRegion': 'p#locationsRegion',
    'selectionRegion': 'p#selectionRegion',
    'collagegraphRegion' : '#collageRegion'
  }
});

Lizard.Graphs.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'graphs': 'graphs'
    }
});

Lizard.Graphs.Timeseries = new Lizard.collections.Timeseries;

Lizard.collections.Workspace = Backbone.Collection.extend({
  model: Lizard.models.WorkspaceItem,
  initialize: function(){
    this.on('add', function(model){
      tseries = model.attributes.tseries;
      for (i in tseries){
        timeserie = new Lizard.models.Timeserie({url: tseries[i], id: tseries[i]})
        Lizard.Graphs.Timeseries.add(timeserie);
      }
    });
    this.on('remove', function(model){
      tseries = model.attributes.tseries;
      for (i in tseries){
        Lizard.Graphs.Timeseries.remove(tseries[i]);
      }
    });
  }
});

Lizard.Graphs.Workspace = new Lizard.collections.Workspace;

Lizard.views.Timeserie = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: function(model){
      return _.template($('#workspace-item-template').html(), {
        name: model.name,
        events: model.events
      }, {variable: 'workspace'});
    },

});

Lizard.views.Timeseries = Backbone.Marionette.CollectionView.extend({
  collection: Lizard.Graphs.Timeseries,
  tagName: 'ul',
  itemView: Lizard.views.Timeserie,

});


Lizard.Graphs.graphs = function(){
  console.log('Lizard.Graphs.graphs()');

  // Instantiate Graphs's default layout
  var graphsView = new Lizard.Graphs.DefaultLayout();
  
  Lizard.App.content.show(graphsView);
  var collageView = new CollageView();
  var workspaceView = new Lizard.views.Timeseries();

  graphsView.filtersRegion.show(filtercollectionview.render());
  graphsView.locationsRegion.show(locationcollectionview.render());
  graphsView.parametersRegion.show(parametercollectionview.render());
  graphsView.selectionRegion.show(workspaceView.render());
  graphsView.collagegraphRegion.show(collageView.render());

  // var timeserieView = new Lizard.Graphs.TimeserieView();
  // graphsView.mainRegion.show(timeserieView.render());


  window.graphsView = graphsView; // so it's available outside this controller

  // And set URL to #graphs
  Backbone.history.navigate('graphs');
};

Lizard.App.addInitializer(function(){
  Lizard.Graphs.router = new Lizard.Graphs.Router({
    controller: Lizard.Graphs
  });
  
  Lizard.App.vent.trigger('routing:started');
});







