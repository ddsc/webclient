/**
Models
*/


Lizard.models = {};

Lizard.models.Filter = Backbone.Model.extend({
  defaults: {
    'selected':  false
  }
});


Lizard.models.Timeserie = Backbone.Model.extend({
  initialize: function(response) {
    this.url = response.url;
    this.fetch({async: false, cache: true});
  },
  defaults: {
    'selected':  false
  },
});

Lizard.models.Location = Backbone.Model.extend({
  defaults: {
    'selected':  false
  },
});

Lizard.models.Parameter = Backbone.Model.extend({
  defaults: {
    'selected':  false
  }
});

Lizard.models.Widget = Backbone.Model.extend({});

Lizard.models.Collage = Backbone.Model.extend({
  initialize: function() {
    this.url = response.url;
    this.fetch({cache: true});
  }
});




