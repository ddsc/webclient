Lizard.Home = {};

Lizard.Home.DefaultView = Backbone.Marionette.ItemView.extend({
  template: '#home-template',
  className: 'home',
  onShow: function() {
    console.log('onShow()');
    $('.search-query').focus();

    var visualSearch = VS.init({
      container : $('.visual_search'),
      placeholder: 'Zoeken naar...',
      query     : '',
      callbacks : {
        search       : function(query, searchCollection) {},
         facetMatches : function(callback) {
           callback([
               'filter', 'location', 'parameter'
              // { label: 'city',    category: 'location' }
           ]);
        },
        valueMatches : function(facet, searchTerm, callback) {
          // TODO: We're doing unnecessary AJAX calls here,
          // we already have the collections, so using those would be nice instead.
          switch (facet) {
            case 'filter':
              $.getJSON('http://test.api.dijkdata.nl/api/v0/logicalgroups/?page_size=0', function(logicalgroups) {
                var lg = [];
                _.each(logicalgroups, function(logicalgroup) { lg.push(logicalgroup.name); });
                callback(lg);
              });
              break;
            case 'location':
              $.getJSON('http://test.api.dijkdata.nl/api/v0/locations/?page_size=0', function(locations) {
                var lc = [];
                _.each(locations, function(location) { lc.push(location.name); });
                callback(lc);
              });
              break;
            case 'parameter':
              $.getJSON('http://test.api.dijkdata.nl/api/v0/parameters/?page_size=0', function(parameters) {
                var pm = [];
                _.each(parameters, function(parameter) { pm.push(parameter.description); });
                callback(pm);
              });
              break;
          }
        }
      }
    });
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