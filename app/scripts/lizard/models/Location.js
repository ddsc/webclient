Lizard.Models.Location = Backbone.Model.extend({
  initialize: function(response) {
    this.url = response.url;
    this.id = response.uuid;
    this.pk = response.id;
  },
  defaults: {
    'selected':  false
  },
});