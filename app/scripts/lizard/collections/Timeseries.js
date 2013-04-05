/* TIMESERIES COLLECTIONS */

Lizard.Collections.InfiniteTimeseries = Backbone.Collection.extend({
  url: function() {
    return 'http://api.dijkdata.nl/api/v0/timeseries/?page=' + this.page;
  },
  parse: function(resp, xhr) {
    return resp.results;
  },
  page: 1
});

Lizard.Collections.Timeseries = Backbone.Collection.extend({
  initialize: function(){
   this.fetch({
      cache: false
    });
  },
  comparator: function(timeserie) {
    return timeserie.get('name');
  },
  url: settings.timeseries_url,
  model: Lizard.Models.Timeserie
});
