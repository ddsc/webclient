Lizard.Models.Timeserie = Backbone.Model.extend({
  initialize: function(response) {
    this.url = response.url;
    this.id = response.uuid;
  },
  defaults: {
    'selected':  false,
    'favorite': false
  }
});