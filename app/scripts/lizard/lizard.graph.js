Lizard.Graphs = {};


Lizard.Graphs.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#graphs-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'mainRegion': '#mainRegion',
    'presetsRegion': '#presetsRegion',
    'favoriteRegion': '#favoriteRegion',
    'selectionSearch': '#selectionSearch',
    'selectionRegion': '#selectionRegion',
    'infomodal': '#info-modal',
    'legend1': '#legend-one',
    'legend2': '#legend-two'
  },
  triggers: {
    'click #mainRegion': 'ui:expand:mainregion'
  }
});

Lizard.Graphs.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'graphs': 'graphs',
      'graphs/:collageid': 'graphs' // if collage is present with id then show
    }
});

Lizard.Graphs.graphs = function(collageid){
 console.log('Lizard.Graphs.graphs()');

  // Instantiate Graphs's default layout
  var graphsView = new Lizard.Graphs.DefaultLayout();

  graphsView.on('ui:expand:sidebar', function(args) {
    $('#sidebar').removeClass('span3').addClass('span5');
    $('#mainRegion').removeClass('span9').addClass('span7');
  });
  graphsView.on('ui:expand:mainregion', function(args) {
    $('#sidebar').removeClass('span5').addClass('span3');
    $('#mainRegion').removeClass('span7').addClass('span9');
  });

  Lizard.App.content.show(graphsView);

  var favoritecollectionview = new Lizard.Views.FavoriteCollection();
  var timeserieSearch = new Lizard.Views.TimeseriesSearch();
  var timeserieView = new Lizard.Views.Timeseries();

  graphsView.legend1.show(new GraphLegendCollectionView({collection:new Lizard.Collections.Graph()}));
  graphsView.legend2.show(new GraphLegendCollectionView({collection:new Lizard.Collections.Graph()}));

  var collageListView = new Lizard.Views.CollageList({
    collection: collageCollection
  });

  collageCollection.fetch({success: function(col){
    col.trigger('gotAll', col);
  }});

  graphsView.presetsRegion.show(collageListView.render());
  
  graphsView.favoriteRegion.show(favoritecollectionview);

  graphsView.selectionSearch.show(timeserieSearch.render());
  graphsView.selectionRegion.show(timeserieView.render());

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
  Lizard.Graphs.router = new Lizard.Graphs.Router({
    controller: Lizard.Graphs
  });
  
  Lizard.App.vent.trigger('routing:started');
});
