Lizard.Home = {};

Lizard.Home.DefaultView = Backbone.Marionette.ItemView.extend({
  template: '#home-template',
  className: 'home',
  onShow: Lizard.Visualsearch.init,
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


  var index = lunr(function () {
    this.field('title', {boost: 10})
    this.field('body')
    this.ref('id')
  });
  timeseriesCollection.each(function(ts) {
    console.log(ts);
  });
  // console.log(index);


  Lizard.App.content.show(homeView);
  Backbone.history.navigate('home');
};

Lizard.App.addInitializer(function(){
  Lizard.Home.router = new Lizard.Home.Router({
    controller: Lizard.Home
  });
  
  Lizard.App.vent.trigger('routing:started');
});