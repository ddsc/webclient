/* TIMESERIES COLLECTIONS */

Lizard.Collections.InfiniteTimeseries = Backbone.Collection.extend({
  url: function() {
    return settings.timeseries_url + '&order=name&value_type=0,1&page_size=' + this.pageSize + '&page=' + this.page + '&name=' + this.query;
  },
  // COMPARATOR DOES NOT WORK WELL HERE, MUST HAVE PROPER ORDERING ON SERVER RETURN?
  parse: function(resp, xhr) {
    if (resp.next == null) {
      this.page -=1;
    }
    return resp.results;
  },
  page: 1,
  pageSize: 20,
  query: ''
});

Lizard.Collections.Timeseries = Backbone.Collection.extend({
  comparator: function(timeserie) {
    return timeserie.get('name');
  },
  url: settings.timeseries_url,
  model: Lizard.Models.Timeserie
});

Lizard.Collections.Events = Backbone.Collection.extend({
  url: settings.timeseries_url,
  model: Lizard.Models.Event,
  parse: function(resp, xhr) {
    return resp;
  }
});
