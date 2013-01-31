/**
models
*/


Lizard.models = {};

Lizard.models.Filter = Backbone.Model.extend({
  initialize: function() {
    console.log('FilterModel initializing');
  },
  defaults: {
    'selected':  false
  },
  parse: function(data) {
    console.log(data);
    if(data.results) {
      return data.results;
    } else {
      return data;
    }
  }
});

Lizard.models.Location = Backbone.Model.extend({
  initialize: function(model) {
    console.log('LocationModel initializing');
  },
  defaults: {
    'selected':  false
  },
  parse: function(data) {
    console.log(data);
    if(data.results) {
      return data.results;
    } else {
      return data;
    }
  }
});

Lizard.models.Parameter = Backbone.Model.extend({
  initialize: function() {
    console.log('ParameterModel initializing');
  },
  defaults: {
    'selected':  false
  },
  parse: function(data) {
    console.log(data);
    if(data.results) {
      return data.results;
    } else {
      return data;
    }
  }
});

Lizard.models.Collage = Backbone.Model.extend({
  initialize: function() {
  }
});
