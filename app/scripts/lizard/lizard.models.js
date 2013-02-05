/**
Models
*/


Lizard.models = {};

Lizard.models.Filter = Backbone.Model.extend({
  initialize: function() {
    // console.log('FilterModel initializing');
  },
  defaults: {
    'selected':  false
  }
});


Lizard.models.Timeserie = Backbone.Model.extend({
  initialize: function(response) {
  },
  defaults: {
    'selected':  false
  },
});

Lizard.models.Location = Backbone.Model.extend({
  initialize: function(response){
  },
  defaults: {
    'selected':  false
  },
});

Lizard.models.Parameter = Backbone.Model.extend({
  initialize: function() {
    // console.log('ParameterModel initializing');
  },
  defaults: {
    'selected':  false
  }
});

Lizard.models.Collage = Backbone.Model.extend({
  initialize: function() {
  }
});