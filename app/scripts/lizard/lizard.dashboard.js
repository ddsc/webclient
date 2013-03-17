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
    new Lizard.Models.Widget({col:1,row:1,size_x:2,size_y:4,gaugeId:4,type:'template', template:'#dashboard-list'}),
    new Lizard.Models.Widget({col:1,row:5,size_x:2,size_y:3,gaugeId:6,type:'template', template:'#dmc-status'}),
    new Lizard.Models.Widget({col:2,row:1,size_x:7,size_y:4,gaugeId:3,type:'graph', timeseries:''}),
    //new Lizard.Models.Widget({col:2,row:1,size_x:7,size_y:4,gaugeId:3,type:'template', template:'#image-dmc'}),
    new Lizard.Models.Widget({col:2,row:3,size_x:7,size_y:3,gaugeId:2,type:'template', template:'#dmc-overview'}),
    new Lizard.Models.Widget({col:3,row:1,size_x:3,size_y:2,gaugeId:4,type:'template', template:'#dashboard-logo'}),
    new Lizard.Models.Widget({col:3,row:3,size_x:3,size_y:2,gaugeId:5,title:'Huidige capaciteit',label:'%'}),
    new Lizard.Models.Widget({col:3,row:5,size_x:3,size_y:2,gaugeId:7,title:'Afgelopen week',label:'m3'}),
    new Lizard.Models.Widget({col:3,row:7,size_x:3,size_y:1,gaugeId:8,type:'template', template:'#settings-button'})
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









