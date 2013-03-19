Lizard.Home = {};

Lizard.Home.DefaultView = Backbone.Marionette.Layout.extend({
  template: '#home-template',
  className: 'home',
  onShow: Lizard.Visualsearch.init,
  onDomRefresh: function() {
    console.log('onDomRefresh');
  },
  regions: {
    'measureAlarm': '#measure-alarm',
    'measureNewMeasurement': '#measure-new-measurement',
    'measureStatus' : '#measure-status',
    'map_links': '#map-links',
    'graph_links': '#graph-links',
    'dashboard_links': '#dashboard-links',
    'status': '#status-overview',
    'liveFeed': '#liveFeed'
  }
});

Lizard.Home.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      '': 'home',
      'home': 'home'
    }
});

Lizard.Home.home = function(){
  console.log('Lizard.Home.home()');

  Lizard.homeView = new Lizard.Home.DefaultView();

  Lizard.App.content.show(Lizard.homeView);

  // This is lunr.js, see http://lunrjs.com/ for more information
  // Define the search index for timeseries
  var timeseries_idx = lunr(function () {
    this.field('name', {boost: 10});
    this.ref('id');
  });
  // Fetch the entire timeseries collection...
  timeseriesCollection.fetch({
    success: function(e) {
      // ...and on success, loop over every model in the collection
      _.each(e.models, function(ts) {
        // Then, add each model to the timeseries index.
        timeseries_idx.add({
          'name': ts.attributes.name,
          'id': ts.id
        });
      });
    }
  });
  window.timeseries_idx = timeseries_idx; // Attach to the window variable
  console.log('timeseries_idx:', timeseries_idx);

  var statusOverview = new Marionette.ItemView({
    template: '#homepage-status-template',
    model: currentStatus
  });

  var liveFeedView = new Marionette.CollectionView({
    collection: liveFeedCollection,
    tagName: 'div',
    className: '',
    itemView: Marionette.ItemView.extend({
      template: '#homepage-livefeed-template',
      tagName: 'div',
      className: 'row-fluid'
    })
  });

  Lizard.homeView.status.show(statusOverview);
  Lizard.homeView.liveFeed.show(liveFeedView);

  function addWidgetToView(settings, view) {
    var model = new Lizard.Models.Widget(settings);
    var widget = new Lizard.Widgets.GageWidget({model: model, tagName: 'div'});
    view.show(widget.render());
  }

  addWidgetToView({col:3,row:3,size_x:2,size_y:2,gaugeId:'widgetAlarmGauge',title:'Alarmen',label:'Actief', max:20, value: currentStatus.get('alarms'),
      levelColors:['FFFF00','FF0000']},
      Lizard.homeView.measureAlarm);
  addWidgetToView({col:3,row:3,size_x:2,size_y:2,gaugeId:'widgetNewMeasurment',title:'Nieuwe metingen',label:'Afgelopen uur', max:2000, value: currentStatus.get('newMeasurementsLastHour'),
      levelColors:['FFFF00','00CC00']},
      Lizard.homeView.measureNewMeasurement);
  addWidgetToView({col:3,row:3,size_x:2,size_y:2,gaugeId:'widgetMeasureStatus',title:'Storingen',label:'Sensoren', max:20, value: currentStatus.get('storingen'),
      levelColors:['FFFF00','FF0000']},
      Lizard.homeView.measureStatus);


  var workspaceSelectionView = new Lizard.Views.HomePageList({
    collection: workspaceCollection
  });

  var collageSelectionView = new Lizard.Views.HomePageList({
    collection: collageCollection
  });

  Lizard.homeView.map_links.show(workspaceSelectionView);
  Lizard.homeView.graph_links.show(collageSelectionView);

  Backbone.history.navigate('home');
};

Lizard.App.addInitializer(function(){
  Lizard.Home.router = new Lizard.Home.Router({
    controller: Lizard.Home
  });
  
  Lizard.App.vent.trigger('routing:started');
});