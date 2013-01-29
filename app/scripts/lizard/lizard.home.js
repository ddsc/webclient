Lizard.Home = {};

Lizard.Home.DefaultView = Backbone.Marionette.ItemView.extend({
  template: '#home-template',
  className: 'home',
  onShow: function() {
    console.log('onShow()');
    $('.search-query').focus();
  },
  onDomRefresh: function() {
    console.log('onDomRefresh');
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
  
  var homeView = new Lizard.Home.DefaultView();

  Lizard.App.content.show(homeView);
  Backbone.history.navigate('home');
};

Lizard.App.addInitializer(function(){
  Lizard.Home.router = new Lizard.Home.Router({
    controller: Lizard.Home
  });
  
  Lizard.App.vent.trigger('routing:started');
});