/* TIMESERIES COLLECTIONS */

Lizard.Collections.InfiniteTimeseries = Backbone.Collection.extend({
  url: function() {
    // Only return timeseries of type integer or float.
    // NB: value_type__in doesn't work nor does value_type__lt=2 (2 isn't a valid value_type).
    return settings.timeseries_url + '?value_type__lte=1&ordering=name&page_size=' + this.pageSize + '&page=' + this.page + '&search=' + this.query;
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
  // Overwritten for geotiffs in geotiff.js
  parse: function(resp, xhr) {
    return resp;
  }
});
