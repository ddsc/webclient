Lizard.Windows = {};

Lizard.Windows.Graphs = {};

Lizard.Windows.Graphs.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#graphs-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'mainRegion': '#mainRegion',
    'presetsRegion': '#presetsRegion',
    'favoriteRegion': '#favoriteRegion',
    'selectionSearch': '#selectionSearch',
    'selectionRegion': '#selectionRegion',
    'infomodal': '#info-modal',
    'graphsRegion': '#graphsRegion'
  },
  triggers: {
    // Disabled this, because the graphs aren't really meant to be dynamicly resized.
    // It causes an invalidation of the view, and all data has to be retrieved again.
    //'click #mainRegion': 'ui:expand:mainregion'
  }
});

Lizard.Windows.Graphs.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'graphs': 'graphsRoute',
      'graphs/:collageid': 'graphsRoute' // if collage is present with id then show
    }
});

Lizard.Windows.Graphs.graphsRoute = function(collageid){
  // Instantiate Graphs's default layout
  var graphsView = new Lizard.Windows.Graphs.DefaultLayout();

  // Disabled this, because the graphs aren't really meant to be dynamicly resized (canvas).
  // graphsView.on('ui:expand:sidebar', function(args) {
    // $('#sidebar').removeClass('span3').addClass('span5');
    // $('#mainRegion').removeClass('span9').addClass('span7');
  // });
  // graphsView.on('ui:expand:mainregion', function(args) {
    // $('#sidebar').removeClass('span5').addClass('span3');
    // $('#mainRegion').removeClass('span7').addClass('span9');
  // });

  Lizard.App.content.show(graphsView);

  // for some reason, timeseriesCollection is also a superglobal
  var timeseriesCollection = new Lizard.Collections.Timeseries();

  var favoritecollectionview = new Lizard.Views.FavoriteCollection();

  var timeseriesSearch = new Lizard.Views.TimeseriesSearch();

  var graphCollection = new Lizard.Collections.Graph();
  for (var i=0; i<5; i++) {
    var graph = new Lizard.Models.Graph();
    graphCollection.add(graph);
  }

  var timeseriesView = new Lizard.Views.TimeseriesCollection({
    collection: timeseriesCollection,
    graphCollection: graphCollection
  });

  var graphAndLegendCollectionView = new Lizard.Views.GraphAndLegendCollection({
    collection: graphCollection
  });
  graphsView.graphsRegion.show(graphAndLegendCollectionView);

  var collageListView = new Lizard.Views.CollageList({
    collection: collageCollection,
    graphCollection: graphCollection
  });

  timeseriesCollection.fetch();

  collageCollection.fetch({
    success: function (col) {
      col.trigger('gotAll', col);
    }
  });

  graphsView.presetsRegion.show(collageListView.render());

  graphsView.favoriteRegion.show(favoritecollectionview);

  graphsView.selectionSearch.show(timeseriesSearch.render());
  graphsView.selectionRegion.show(timeseriesView.render());

  // And set URL to #graphs
  if (collageid) {
    collageCollection.listenTo(collageCollection, 'gotAll', function(col){
      var selectedCollage = collageCollection.get(collageid);
      selectedCollage.set('selected', true);
      col.trigger('select_collage', selectedCollage);
    });
  } else {
    Backbone.history.navigate('graphs');
  }
};

Lizard.App.addInitializer(function(){
  Lizard.Windows.Graphs.router = new Lizard.Windows.Graphs.Router({
    controller: Lizard.Windows.Graphs
  });
});
