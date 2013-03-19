Lizard.Graphs = {};


Lizard.Graphs.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#graphs-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'mainRegion': '#mainRegion',
    'presetsRegion': '#presetsRegion',
    'favoriteRegion': '#favoriteRegion',
    'selectionRegion': '#selectionRegion',
    'infomodal': '#info-modal'
  },
  onShow: Lizard.Visualsearch.init,
  triggers: {
    'click #sidebar': 'ui:expand:sidebar',
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
  var timeserieView = new Lizard.Views.Timeseries();

  var collageListView = new Lizard.Views.CollageList({
    collection: collageCollection
  });

  collageCollection.fetch({success: function(col){
    col.trigger('gotAll', col);
  }});

  graphsView.presetsRegion.show(collageListView.render());
  
  graphsView.favoriteRegion.show(favoritecollectionview.render());
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







