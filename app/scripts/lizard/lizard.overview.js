Lizard.Overview = {};


Lizard.Overview.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#overview-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'dashboardRegion': '#dashboardRegion'
  }
});

Lizard.Overview.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'overview': 'overview'
    }
});


Lizard.Overview.overview = function(){
  console.log('Lizard.Overview.overview()');

  // Instantiate Overview's default layout
  var overviewView = new Lizard.Overview.DefaultLayout();
  Lizard.App.content.show(overviewView);

  overviewView.dashboardRegion.show(widgetcollectionview.render());
  Backbone.history.navigate('overview');
};

Lizard.App.addInitializer(function(){
  Lizard.Overview.router = new Lizard.Overview.Router({
    controller: Lizard.Overview
  });
  
  Lizard.App.vent.trigger('routing:started');
});









