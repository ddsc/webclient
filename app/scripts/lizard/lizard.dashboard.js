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

  dashboardView.dashboardRegion.show(widgetcollectionview.render());
  Backbone.history.navigate('dashboard');
};

Lizard.App.addInitializer(function(){
  Lizard.Dashboard.router = new Lizard.Dashboard.Router({
    controller: Lizard.Dashboard
  });
  
  Lizard.App.vent.trigger('routing:started');
});









