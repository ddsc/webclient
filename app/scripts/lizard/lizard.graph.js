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
  onShow: Lizard.Visualsearch.init,
  triggers: {
    'hover #sidebar': 'ui:expand:sidebar',
    // 'mouseleave #sidebar': 'ui:collapse:sidebar',
    'hover #mainRegion': 'ui:expand:mainregion',
    'mouseleave #mainRegion': 'ui:collapse:mainregion'
  }
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

  graphsView.on('ui:expand:sidebar', function(args) {
    $('#sidebar').removeClass('span3').addClass('span5');
    $('#mainRegion').removeClass('span9').addClass('span7');
  });
  graphsView.on('ui:collapse:sidebar', function(args) {
    $('#sidebar').removeClass('span5').addClass('span3');
    $('#mainRegion').removeClass('span7').addClass('span9');
  });
  graphsView.on('ui:expand:mainregion', function(args) {
    $('#sidebar').removeClass('span5').addClass('span3');
    $('#mainRegion').removeClass('span7').addClass('span9');
  });
  graphsView.on('ui:collapse:mainregion', function(args) {
    $('#sidebar').removeClass('span3').addClass('span5');
    $('#mainRegion').removeClass('span9').addClass('span7');
  });


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







