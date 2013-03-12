Lizard.Graphs = {};


Lizard.Graphs.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#graphs-template',
  regions: {
    'presetsRegion': '#presetsRegion',
    'sidebarRegion': '#sidebarRegion',
    'mainRegion': '#mainRegion',
    'presetsRegion': '#presetsRegion',
    'favoriteRegion': '#favoriteRegion',
    'selectionRegion': '#selectionRegion',
    'infomodal': '#info-modal'
  },
  onShow: Lizard.Visualsearch.init,
  triggers: {
    'hover #sidebar': 'ui:expand:sidebar',
    // 'mouseleave #sidebar': 'ui:collapse:sidebar',
    'hover #mainRegion': 'ui:expand:mainregion',
    //'mouseleave #mainRegion': 'ui:collapse:mainregion'
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
  /*graphsView.on('ui:collapse:sidebar', function(args) {
    $('#sidebar').removeClass('span5').addClass('span3');
    $('#mainRegion').removeClass('span7').addClass('span9');
  });*/
  graphsView.on('ui:expand:mainregion', function(args) {
    $('#sidebar').removeClass('span5').addClass('span3');
    $('#mainRegion').removeClass('span7').addClass('span9');
  });
  /*graphsView.on('ui:collapse:mainregion', function(args) {
    $('#sidebar').removeClass('span3').addClass('span5');
    $('#mainRegion').removeClass('span9').addClass('span7');

  });*/

  Lizard.App.content.show(graphsView);

  var favoritecollectionview = new Lizard.Views.FavoriteCollection();
  var timeserieView = new Lizard.Views.Timeseries();

  var collageListView = new Lizard.Views.CollageList({
    collection: collageCollection
  });
  graphsView.presetsRegion.show(collageListView);
  
  graphsView.favoriteRegion.show(favoritecollectionview.render());
  graphsView.selectionRegion.show(timeserieView.render());

  // And set URL to #graphs
  Backbone.history.navigate('graphs');
};

Lizard.App.addInitializer(function(){
  Lizard.Graphs.router = new Lizard.Graphs.Router({
    controller: Lizard.Graphs
  });
  
  Lizard.App.vent.trigger('routing:started');
});







