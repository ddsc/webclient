/* TIMESERIES COLLECTIONS */

Lizard.Collections.InfiniteTimeseries = Backbone.Collection.extend({
  url: function() {
    console.log('Lizard.Collections.InfiniteTimeseries.url()', this.page);
    return 'http://api.dijkdata.nl/api/v1/timeseries?page_size=20&page=' + this.page;
  },
  // COMPARATOR DOES NOT WORK WELL HERE...
  // comparator: function(timeserie) {
  //   return timeserie.get('name');
  // },
  parse: function(resp, xhr) {
    console.log('Lizard.Collections.InfiniteTimeseries.parse()', resp.results);
    return resp.results;
  },
  page: 1
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
