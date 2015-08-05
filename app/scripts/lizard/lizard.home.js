Lizard.Home = {};

Lizard.Home.DefaultView = Backbone.Marionette.Layout.extend({
  template: '#home-template',
  className: 'home',
  //onShow: Lizard.Visualsearch.init,
  onDomRefresh: function() {
    console.log('onDomRefresh');
  },
  events: {
    'click #measure-alarm': 'openAlarm',
    'click #measure-status': 'openStatus'
  },
  openAlarm: function () {
    location.hash = "map/alarm";
  },
  openStatus: function () {
    location.hash = "map/status";
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


  function addWidgetToView(settings, view) {
    var model = new Lizard.Models.Widget(settings);
    var widget = new Lizard.ui.Widgets.GageWidget({model: model, tagName: 'div'});
    view.show(widget.render());
  }

  Lizard.Home.Summary = Backbone.Model.extend({
    defaults: {
      alarms: {active: 0},
      events: {"new": 0},
      timeseries: {disrupted:0}
    }
  });
  var summary = new Lizard.Home.Summary();
  summary.url = settings.alarms_url;
  summary.fetch({success: function(model, xhr){
    var maxActiveCount = 50;
    var activeCount = model.get('count');

    var maxNewMeasurementCount = 200000;
    var newMeasurementCount =
    Math.round(Math.random() * maxNewMeasurementCount) + maxNewMeasurementCount;

    addWidgetToView({col:3,row:3,size_x:2,size_y:2,gaugeId:'widgetAlarmGauge',title:'Alarmen',label:'Actief', max:maxActiveCount, value: activeCount,
          levelColors:['FFFF00','FF0000']},
          Lizard.homeView.measureAlarm);
    addWidgetToView({col:3,row:3,size_x:2,size_y:2,gaugeId:'widgetNewMeasurment',title:'Nieuwe metingen',label:'Gisteren', max:maxNewMeasurementCount, value: newMeasurementCount,
          levelColors:['FFFF00','00CC00']},
          Lizard.homeView.measureNewMeasurement);

    $.get(settings.timeseries_url + 'late/').success(function (resp) {
      var maxDisruptedTimeseriesCount = 20;
      var disruptedTimeseriesCount = resp.count;
      addWidgetToView({col:3,row:3,size_x:2,size_y:2,gaugeId:'widgetMeasureStatus',title:'Storingen',label:'Sensoren', max:maxDisruptedTimeseriesCount, value: disruptedTimeseriesCount,
            levelColors:['FFFF00','FF0000']},
            Lizard.homeView.measureStatus);
    });
  }});

  var statusOverview = new Backbone.Marionette.ItemView({
    model: summary,
    template: '#homepage-status-template',
    modelEvents:{
      'change':'render'
    }
  });

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
    backdrop: true
  });
  tour.addStep({
      element: ".map-menu",
      title: "Kaart",
      placement: "bottom",
      content: "Welkom op DDSC.nl - Je kunt naar kaarten en grafieken via dit menu"
  });
  tour.addStep({
      element: "#status-overview",
      title: "Status overzicht",
      placement: "right",
      content: "Overzicht van de actieve alarmen, storingen en nieuwe metingen van gisteren"
  });
  tour.addStep({
      element: "#map-links",
      title: "Kaarten",
      placement: "right",
      content: "Snelkoppelingen naar kaarten"
  });
  tour.addStep({
      element: "#graph-links",
      title: "Grafieken",
      placement: "right",
      content: "Snelkoppelingen naar uw opgeslagen grafiekenschermen"
  });
  tour.addStep({
      element: "#measure-alarm",
      title: "Alarmen",
      placement: "right",
      content: "Totaal aantal alarmen in één oogopslag"
  });
  tour.addStep({
      element: "#measure-new-measurement",
      title: "Nieuwe metingen",
      placement: "top",
      content: "Aantal metingen dat gisteren is binnengekomen"
  });
  tour.addStep({
      element: "#measure-status",
      title: "Storingen",
      placement: "left",
      content: "Aantal tijdseries dat al te lang niet meer is binnengekomen"
  });
};

Lizard.App.addInitializer(function(){
  Lizard.Home.router = new Lizard.Home.Router({
    controller: Lizard.Home
  });
});
