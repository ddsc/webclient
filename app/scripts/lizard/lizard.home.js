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

  // This is lunr.js, see http://lunrjs.com/ for more information
  // Define the search index for timeseries
  var timeseries_idx = lunr(function () {
    this.field('name', {boost: 10});
    this.ref('id');
  });
  // Fetch the entire timeseries collection...
  timeseriesCollection.fetch({
    success: function(e) {
      // ...and on success, loop over every model in the collection
      _.each(e.models, function(ts) {
        // Then, add each model to the timeseries index.
        timeseries_idx.add({
          'name': ts.attributes.name,
          'id': ts.id
        });
      });
    }
  });
  window.timeseries_idx = timeseries_idx; // Attach to the window variable
  console.log('timeseries_idx:', timeseries_idx);


  Lizard.App.content.show(homeView);
  Backbone.history.navigate('home');
};

Lizard.App.addInitializer(function(){
  Lizard.Home.router = new Lizard.Home.Router({
    controller: Lizard.Home
  });
  
  Lizard.App.vent.trigger('routing:started');
});