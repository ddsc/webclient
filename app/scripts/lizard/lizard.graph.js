Lizard.Graphs = {};


Lizard.Graphs.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#graphs-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'mainRegion': '#mainRegion',
    'parametersRegion': '#parametersRegion',
    'filtersRegion': '#filtersRegion',
    'favoriteRegion': '#favoriteRegion',
    'locationsRegion': '#locationsRegion',
    'selectionRegion': '#selectionRegion',
    'collagegraphRegion' : '#collageRegion',
    'infomodal': '#info-modal'

  },
  onShow: Lizard.Visualsearch.init
});

Lizard.Graphs.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'graphs': 'graphs'
    }
});

Lizard.Graphs.graphs = function(){
  console.log('Lizard.Graphs.graphs()');

  // Instantiate Graphs's default layout
  var graphsView = new Lizard.Graphs.DefaultLayout();
  window.graphsView = graphsView;

  Lizard.App.content.show(graphsView);
  var collageView = new CollageView();
  var timeserieView = new Lizard.Views.Timeseries();
  
  graphsView.favoriteRegion.show(favoritecollectionview.render());
  graphsView.filtersRegion.show(filtercollectionview.render());
  graphsView.locationsRegion.show(locationcollectionview.render());
  graphsView.parametersRegion.show(parametercollectionview.render());
  graphsView.selectionRegion.show(timeserieView.render());
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







