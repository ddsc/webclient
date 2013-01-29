/**
Models
*/

Lizard.Models = {};

Lizard.Models.FilterModel = Backbone.Model.extend({
  initialize: function() {
    console.log('FilterModel initializing');
  },
  defaults: {
    'selected':  false
  }
});

Lizard.Models.LocationModel = Backbone.Model.extend({
  initialize: function(model) {
    console.log('LocationModel initializing');
    this.url = model.url;
    this.fetch();
  },
});

Lizard.Models.ParameterModel = Backbone.Model.extend({
  initialize: function() {
    console.log('ParameterModel initializing');
  }
});

Lizard.Models.CollageModel = Backbone.Model.extend({
  initialize: function() {
  }
});
