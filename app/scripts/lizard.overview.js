Lizard.Overview = {};

Lizard.Overview.DefaultView = Backbone.Marionette.ItemView.extend({
  template: '#overview-template',
  className: 'overview'
});

Lizard.Overview.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'overview': 'overview'
    }
});

Lizard.Overview.overview = function(){
  console.log('Lizard.Overview.overview()');
  var overviewView = new Lizard.Overview.DefaultView();
  Lizard.content.show(overviewView);
  Backbone.history.navigate('overview');
};

Lizard.addInitializer(function(){
  Lizard.Overview.router = new Lizard.Overview.Router({
    controller: Lizard.Overview
  });
  
  Lizard.vent.trigger('routing:started');
});