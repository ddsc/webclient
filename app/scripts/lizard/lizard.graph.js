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
  tagName: 'li',
  template: function(model){
      return _.template($('#workspace-item-template').html(), {
        name: model.name,
        events: model.events
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







