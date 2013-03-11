Lizard.Tabular = {};


Lizard.Tabular.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#tabular-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'tabularRegion': '#tabularRegion'
  }
});

Lizard.Tabular.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'tabular': 'tabular'
    }
});


Lizard.Tabular.tabular = function(){
  console.log('Lizard.Tabular.overview()');

  // Instantiate Tabular's default layout
  var tabularView = new Lizard.Tabular.DefaultLayout();
  Lizard.App.content.show(tabularView);

  // tabularView.tabularRegion.show(widgetcollectionview.render());
  Backbone.history.navigate('tabular');
};

Lizard.App.addInitializer(function(){
  Lizard.Tabular.router = new Lizard.Tabular.Router({
    controller: Lizard.Tabular
  });
  
  Lizard.App.vent.trigger('routing:started');
});









