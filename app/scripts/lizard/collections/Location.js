Lizard.Collections.Location = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Location collection initializing');
  },
  url: settings.locations_url,
  model: Lizard.Models.Location
});


Lizard.Collections.LocationSearch = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Location collection initializing');
  },
  url: function () {
    return settings.locations_search_url + 'q=' + this.query
  },
  query: '',
  model: Lizard.Models.Location
});
