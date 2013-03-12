Lizard.Dashboard = {};


Lizard.Dashboard.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#dashboard-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'dashboardRegion': '#dashboardRegion'
  }
});

Lizard.Dashboard.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'dashboard': 'dashboard'
    }
});



Lizard.Dashboard.dashboard = function(){
  console.log('Lizard.Dashboard.overview()');

  // Instantiate Dashboard's default layout
  var dashboardView = new Lizard.Dashboard.DefaultLayout();
  Lizard.App.content.show(dashboardView);

  var widgetcollectionview = new Lizard.Views.WidgetCollection();

  widgetcollectionview.collection.add([
    new Lizard.Models.Widget({col:3,row:5,size_x:2,size_y:2,gaugeId:1,title:'Amstel',label:'Verplaatsing (m/s)'}),
    new Lizard.Models.Widget({col:1,row:1,size_x:2,size_y:2,gaugeId:2,title:'Waternet',label:'Debiet (m3)'}),
    new Lizard.Models.Widget({col:3,row:3,size_x:2,size_y:2,gaugeId:3,title:'Rijn',label:'Volume (m3)'}),
    new Lizard.Models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:4,title:'Dijk 22',label:'Sulfiet'}),
    new Lizard.Models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:5,title:'Dijk 23',label:'Temperatuur (c)'}),
    new Lizard.Models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:6,title:'Dijk 24',label:'Druk'})
  ]);


  dashboardView.dashboardRegion.show(widgetcollectionview.render());
  Backbone.history.navigate('dashboard');
};

Lizard.App.addInitializer(function(){
  Lizard.Dashboard.router = new Lizard.Dashboard.Router({
    controller: Lizard.Dashboard
  });
  
  Lizard.App.vent.trigger('routing:started');
});









