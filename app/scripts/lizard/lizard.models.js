/**
models
*/


Lizard.models = Lizard.Models = {};

Lizard.models.Filter = Backbone.Model.extend({
  initialize: function() {
    console.log('FilterModel initializing');
  },
  defaults: {
    'selected':  false
  }
});

Lizard.models.Location = Backbone.Model.extend({
  initialize: function(model) {
    console.log('LocationModel initializing');
    this.url = model.url;
    console.log(model.url);
    this.fetch();
  },
});

Lizard.models.Parameter = Backbone.Model.extend({
  initialize: function() {
    console.log('ParameterModel initializing');
  }
});

Lizard.models.Collage = Backbone.Model.extend({
  initialize: function() {
  }
});
