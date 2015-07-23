Lizard.Models.Timeserie = Backbone.Model.extend({
  initialize: function(response) {
    this.url = response.url;
    this.attributes.pk = response.id;
    this.attributes.parameter_referenced_unit = response.parameter_referenced_unit || {};
    this.id = response.uuid;
  },
  defaults: {
    selected: false,
    favorite: false,
    annotations: 0
  }
});

Lizard.Models.Event = Backbone.Model.extend();


/**
 * A Timeseries that is actually linked to the Timeseries API,
 * unlike the above version, which is collection from a nested set,
 * which is transferred all at once.
 */
Lizard.Models.TimeseriesActual = Backbone.Model.extend({
    url: null,
    initialize: function (options) {
        if (options.uuid) {
            this.url = settings.timeseries_url + options.uuid + '/';
        }
        if (options.url) {
            this.url = options.url;
        }
        if (options.pk) {
            this.attributes.pk = options.pk;
        }
    },
    defaults: {
        url: null,
        pk: null
    }
});
