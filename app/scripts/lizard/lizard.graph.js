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
              $.getJSON('http://test.api.dijkdata.nl/api/v0/logicalgroups/?page_size=0', function(logicalgroups) {
                var lg = [];
                _.each(logicalgroups, function(logicalgroup) { lg.push(logicalgroup.name); });
                callback(lg);
              });
              break;
            case 'location':
              $.getJSON('http://test.api.dijkdata.nl/api/v0/locations/?page_size=0', function(locations) {
                var lc = [];
                _.each(locations, function(location) { lc.push(location.name); });
                callback(lc);
              });
              break;
            case 'parameter':
              $.getJSON('http://test.api.dijkdata.nl/api/v0/parameters/?page_size=0', function(parameters) {
                var pm = [];
                _.each(parameters, function(parameter) { pm.push(parameter.description); });
                callback(pm);
              });
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

Lizard.Graphs.Timeseries = new Lizard.collections.Timeseries;
Lizard.Graphs.Timeseries.fetch();

Lizard.collections.Workspace = Backbone.Collection.extend({
  model: Lizard.models.WorkspaceItem,
  initialize: function(){
    this.on('add', function(model){
      tseries = Lizard.Graphs.Timeseries.models;
      for (i in tseries){
        timeserie = tseries[i]
        parameter = ParameterCollection.get(timeserie.attributes.parameter.id);
        if (parameter != undefined){
          parameter.set({hidden:false});
        }
        // locationuuid = timeserie.attributes.location.split("locations/")[1].split("/")[0];
        // location = LocationCollection.where({uuid: uuid});
        // console.log(location);

      }
    });
    this.on('remove', function(model){
      tseries = model.attributes.tseries;
      for (i in tseries){
        Lizard.Graphs.Timeseries.remove(tseries[i]);
        parameter = ParameterCollection.get(timeserie.attributes.parameter.id);
        if (parameter != undefined){
          parameter.set({hidden:true});
        }
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







