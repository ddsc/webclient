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
    'collagegraphRegion' : '#collageRegion',
    'infomodal': '#info-modal'

  },
  onShow: function() {
    var visualSearch = VS.init({
      container : $('.visual_search'),
      placeholder: 'Zoeken naar...',
      query     : '',
      callbacks : {
        search       : function(query, searchCollection) {},
         facetMatches : function(callback) {
           callback([
               'filter', 'location', 'parameter'
           ]);
        },
        valueMatches : function(facet, searchTerm, callback) {
          // TODO: We're doing unnecessary AJAX calls here,
          // we already have the collections, so using those would be nice instead.
          switch (facet) {
            case 'filter':
                var lg = [];
                var logicalgroups = filterCollection.models;
                _.each(logicalgroups, function(logicalgroups) { lg.push(logicalgroups.attributes.name); });
                callback(lg);
              break;
            case 'location':
                var lc = [];
                var locations = locationCollection.models;
                _.each(locations, function(locations) { lc.push(locations.attributes.name); });
                callback(lc);
              break;
            case 'parameter':
                var pm = [];
                var parameters = parameterCollection.models;
                _.each(parameters, function(parameters) { pm.push(parameters.attributes.description); });
                callback(pm);
              break;
          }
        }
      }
    });
  }
});

Lizard.Graphs.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'graphs': 'graphs'
    }
});

Lizard.Graphs.Timeseries = timeseriesCollection;
Lizard.Graphs.Timeseries.fetch();


Lizard.Views.Timeserie = Backbone.Marionette.ItemView.extend({
  initialize: function() {
    this.model.on('change', this.render, this);
  },
  tagName: 'li',
  events: {
    'click .fav': 'toggleFavorite',
    'click .info': 'showInfoModal'
  },
  toggleFavorite: function(me) {
    var favorite = this.model.get('favorite');
    if(favorite) {
      this.model.set({"favorite": false});
      this.$el.find('i.icon-star').removeClass('icon-star').addClass('icon-star-empty');
    } else {
      this.model.set({"favorite": true});
      this.$el.find('i.icon-star-empty').removeClass('icon-star-empty').addClass('icon-star');
    }
  },
  showInfoModal: function(me) {
    infoModalView = new Lizard.Views.InfoModal();
    window.graphsView.infomodal.show(infoModalView.render());
    $('#info-modal').modal();
  },
  template: function(model){
      return _.template($('#workspace-item-template').html(), {
        name: model.name,
        events: model.events,
        favorite: model.favorite
      }, {variable: 'workspace'});
    },
});

Lizard.Views.Timeseries = Backbone.Marionette.CollectionView.extend({
  collection: Lizard.Graphs.Timeseries,
  tagName: 'ul',
  itemView: Lizard.Views.Timeserie,
});


Lizard.Graphs.graphs = function(){
  console.log('Lizard.Graphs.graphs()');

  // Instantiate Graphs's default layout
  var graphsView = new Lizard.Graphs.DefaultLayout();
  window.graphsView = graphsView;

  Lizard.App.content.show(graphsView);
  var collageView = new CollageView();
  var workspaceView = new Lizard.Views.Timeseries();

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







