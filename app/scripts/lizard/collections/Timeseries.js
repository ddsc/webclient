/* TIMESERIES COLLECTIONS */

Lizard.Collections.InfiniteTimeseries = Backbone.Collection.extend({
  url: function() {
    return 'http://api.dijkdata.nl/api/v1/timeseries?page_size=20&page=' + this.page + '&name=' + this.name;
  },
  // COMPARATOR DOES NOT WORK WELL HERE, MUST HAVE PROPER ORDERING ON SERVER RETURN?
  parse: function(resp, xhr) {
    return resp.results;
  },
  page: 1,
  name: ''
});

Lizard.Collections.Timeseries = Backbone.Collection.extend({
  initialize: function(){
    var self = this;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
      console.log('Not fetching timeseries since we seem to be on a mobile device');
    } else {
      self.fetch({
        cache: true
      });
    }
  },
  comparator: function(timeserie) {
    return timeserie.get('name');
  },
  url: settings.timeseries_url,
  model: Lizard.Models.Timeserie
});
