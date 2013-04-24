Lizard.Windows = {};

Lizard.Windows.Graphs = {};

Lizard.Views.SavePopup = Backbone.Marionette.View.extend({
});

Lizard.Windows.Graphs.DefaultLayout = Backbone.Marionette.Layout.extend({
  initialize: function (options) {
    this.graphCollection = options.graphCollection;
  },
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
  events: {
    'click #reset-collage': 'resetCollage',
    'click #save-collage': 'saveCollage'
  },
  triggers: {
    // Disabled this, because the graphs aren't really meant to be dynamicly resized.
    // It causes an invalidation of the view, and all data has to be retrieved again.
    //'click #mainRegion': 'ui:expand:mainregion'
  },
  resetCollage: function (e) {
    this.graphCollection.each(function (model) {
        model.get('graphItems').reset();
    });
    window.collageCollection.each(function (model) {
        model.set('selected', false);
    });
    Backbone.history.navigate('graphs');
  },
  saveCollage: function (e) {
    var self = this;
    var modal = this.$el.find('#save-modal').modal();
    // attach submit event to spawned form
    modal.find('form').submit(function (e) {
        e.preventDefault();
        var name = $(this).find('input[name="name"]').val();
        var visibility = $(this).find('input[name="visibility"]').val();

        self.graphCollection.saveCollage(name, visibility)
        .done(function () {
            modal.modal('hide');
            // refresh the collages
            window.collageCollection.fetch();
        });
    });
  }
});

Lizard.Windows.Graphs.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'graphs': 'graphsRoute',
      'graphs/:collageid': 'graphsRoute' // if collage is present with id then show
    }
});

Lizard.Windows.Graphs.graphsRoute = function(collageid){
  var graphCollection = new Lizard.Collections.Graph();
  for (var i=0; i<4; i++) {
    var graph = new Lizard.Models.Graph();
    graphCollection.add(graph);
  }

  // Instantiate Graphs's default layout
  var graphsView = new Lizard.Windows.Graphs.DefaultLayout({
    graphCollection: graphCollection
  });


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

  var timeseriesSearch = new Lizard.Views.TimeseriesSearch({
    timeseriesCollection: timeseriesCollection
  });

  var timeseriesView = new Lizard.Views.TimeseriesCollection({
    collection: timeseriesCollection,
    graphCollection: graphCollection
  });

  var graphAndLegendCollectionView = new Lizard.Views.GraphAndLegendCollection({
    collection: graphCollection
  });
  graphsView.graphsRegion.show(graphAndLegendCollectionView);

  var collageListView = new Lizard.Views.CollageList({
    collection: window.collageCollection,
    graphCollection: graphCollection
  });


  window.collageCollection.fetch()
    .done(function (col) {
      col.trigger('gotAll', col);
    });

  graphsView.presetsRegion.show(collageListView.render());

  graphsView.favoriteRegion.show(favoritecollectionview);

  graphsView.selectionSearch.show(timeseriesSearch.render());
  graphsView.selectionRegion.show(timeseriesView.render());

  window.graphsView = graphsView
  // And set URL to #graphs
  if (collageid) {
    window.collageCollection.listenTo(window.collageCollection, 'gotAll', function(col){
      var selectedCollage = window.collageCollection.get(collageid);
      selectedCollage.set('selected', true);
      col.trigger('select_collage', selectedCollage);
    });
  } else {
    Backbone.history.navigate('graphs');
  }

  tour = new Tour({
    labels: {
        next: "Verder »",
        prev: "« Terug",
        end: "Einde uitleg"
    },
    useLocalStorage: false,
    backdrop: true
  });
  tour.addStep({
      element: "#presetsRegion",
      title: "Tijdseries",
      placement: "right",
      content: "Dit zijn de voorgedefinieerde grafieken. Deze bestaan uit meerdere tijdseries. Als de grafiek van u is, kunt u deze verwijderen of opslaan."
  });
  tour.addStep({
      element: "#save-collage",
      title: "Nieuwe collage opslaan",
      placement: "top",
      content: "Hiermee slaat u een nieuwe collage op."
  });
  tour.addStep({
      element: "#selectionRegion",
      title: "Tijdreeksen",
      placement: "right",
      content: "Hier kunt u tijdreeksen uitzoeken om in de grafiek te tekenen. Sleep de gewenste tijdreeks naar de blokken aan de rechterkant. (zodra uw begint te slepen, zullen deze blokken oplichten)"
  });
  tour.addStep({
      element: "#searchTimeseries",
      title: "Zoeken in tijdreeksen",
      placement: "right",
      content: "Hier kunt u de tijdreeksen zoeken die u nodig heeft. (druk op enter om te zoeken)"
  });
  tour.addStep({
      element: $('.legend').first(),
      title: "Legenda",
      placement: "left",
      content: "Dit is de legenda van de grafiek. Bovendien kunt u hier een CSV bestand exporteren of commentaar plaatsen."
  });
  tour.start();
};

Lizard.App.addInitializer(function(){
  Lizard.Windows.Graphs.router = new Lizard.Windows.Graphs.Router({
    controller: Lizard.Windows.Graphs
  });
});
