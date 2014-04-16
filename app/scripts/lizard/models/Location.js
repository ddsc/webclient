Lizard.Models.Location = Backbone.Model.extend({
  initialize: function(response) {
    if (!response.hasOwnProperty('type')) {
        this.url = response.url;
        this.id = response.uuid;
        this.pk = response.id;
    }
  },
  defaults: {
    'selected':  false,
    'annotationCount': null
  }
});