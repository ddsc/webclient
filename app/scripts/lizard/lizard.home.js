Lizard.Home = {};

Lizard.Home.DefaultView = Backbone.Marionette.Layout.extend({
  template: '#home-template',
  className: 'home',
  //onShow: Lizard.Visualsearch.init,
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
    'status': '#status-overview'
    // 'liveFeed': '#liveFeed'
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
  // timeseriesCollection.fetch({
  //   success: function(e) {
  //     // ...and on success, loop over every model in the collection
  //     _.each(e.models, function(ts) {
  //       // Then, add each model to the timeseries index.
  //       timeseries_idx.add({
  //         'name': ts.attributes.name,
  //         'id': ts.id
  //       });
  //     });
  //   }
  // });
  window.timeseries_idx = timeseries_idx; // Attach to the window variable
  console.log('timeseries_idx:', timeseries_idx);

  function addWidgetToView(settings, view) {
    var model = new Lizard.Models.Widget(settings);
    var widget = new Lizard.ui.Widgets.GageWidget({model: model, tagName: 'div'});
    view.show(widget.render());
  }

  Lizard.Home.Summary = Backbone.Model.extend({
    defaults: {
      alarms: {active: 0},
      events: {new: 0},
      timeseries: {disrupted:0}
    }
  });
  var summary = new Lizard.Home.Summary();
  summary.url = 'http://api.dijkdata.nl/api/v1/summary';
  summary.fetch({success: function(model, xhr){

    var maxActiveCount = 50;
    var activeCount = model.get('alarms').active;

    var maxNewMeasurementCount = 200000;
    var newMeasurementCount = model.get('events').new;

    var maxDisruptedTimeseriesCount = 20;
    var disruptedTimeseriesCount = model.get('timeseries').disrupted;

    addWidgetToView({col:3,row:3,size_x:2,size_y:2,gaugeId:'widgetAlarmGauge',title:'Alarmen',label:'Actief', max:maxActiveCount, value: activeCount,
          levelColors:['FFFF00','FF0000']},
          Lizard.homeView.measureAlarm);
    addWidgetToView({col:3,row:3,size_x:2,size_y:2,gaugeId:'widgetNewMeasurment',title:'Nieuwe metingen',label:'Sinds gisteren', max:maxNewMeasurementCount, value: newMeasurementCount,
          levelColors:['FFFF00','00CC00']},
          Lizard.homeView.measureNewMeasurement);
    addWidgetToView({col:3,row:3,size_x:2,size_y:2,gaugeId:'widgetMeasureStatus',title:'Storingen',label:'Sensoren', max:maxDisruptedTimeseriesCount, value: disruptedTimeseriesCount,
          levelColors:['FFFF00','FF0000']},
          Lizard.homeView.measureStatus);
  }});

  var statusOverview = new Backbone.Marionette.ItemView({
    model: summary,
    template: '#homepage-status-template',
    modelEvents:{
      'change':'render'
    }
  });


  // var liveFeedView = new Marionette.CollectionView({
  //   collection: liveFeedCollection,
  //   tagName: 'div',
  //   className: '',
  //   itemView: Marionette.ItemView.extend({
  //     template: '#homepage-livefeed-template',
  //     tagName: 'div',
  //     className: 'row-fluid'
  //   })
  // });
  // Lizard.homeView.liveFeed.show(liveFeedView);


  Lizard.homeView.status.show(statusOverview);

  var workspaceSelectionView = new Lizard.Views.HomePageMapList({
    collection: workspaceCollection
  });


  var collageCollection = new Lizard.Collections.Collage();

  var collageSelectionView = new Lizard.Views.HomePageGraphList({
    collection: collageCollection
  });

  collageCollection.fetch();

  Lizard.homeView.map_links.show(workspaceSelectionView);
  Lizard.homeView.graph_links.show(collageSelectionView);

  Backbone.history.navigate('home');



  tour = new Tour({
    labels: {
        next: "Verder »",
        prev: "« Terug",
        end: "Einde uitleg"
    },
    useLocalStorage: false,
    backdrop: true,
  });
  tour.addStep({
      element: ".map-menu",
      title: "Kaart",
      placement: "bottom",
      content: "Welkom op dijkdata.nl - Je kunt naar kaarten en grafieken via dit menu"
  });
};

Lizard.App.addInitializer(function(){
  Lizard.Home.router = new Lizard.Home.Router({
    controller: Lizard.Home
  });
});
