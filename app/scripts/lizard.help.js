Lizard.Help = {};

Lizard.Help.DefaultView = Backbone.Marionette.ItemView.extend({
  template: '#help-template',
  className: 'help'
});

Lizard.Help.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'help': 'help'
    }
});

Lizard.Help.help = function(){
  console.log('Lizard.Help.help()');
  var helpView = new Lizard.Help.DefaultView();
  Lizard.content.show(helpView);
  Backbone.history.navigate('help');
};

Lizard.addInitializer(function(){
  Lizard.Help.router = new Lizard.Help.Router({
    controller: Lizard.Help
  });
  
  Lizard.vent.trigger('routing:started');
});