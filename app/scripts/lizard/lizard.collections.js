/**
Collections
*/

Lizard.collections = {};

Lizard.collections.Filter = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Filter collection initializing');
  },
  url: settings.filters_url,
  model: Lizard.models.Filter
});

Lizard.collections.Location = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Location collection initializing');
  },
  url: settings.locations_url,
  model: Lizard.models.Location
});

// Lizard.collections.Timeserie = Backbone.Collection.extend({
//   initialize: function() {
//     // console.log('Location timeseries initializing');
//   },
//   url: settings.timeseries_url,
//   model: Lizard.models.Timeserie
// });


Lizard.collections.Parameter = Backbone.Collection.extend({
  initialize: function() {
    console.log('Parameter initializing');
  },
  url: settings.parameters_url,
  model: Lizard.models.Parameter
});

Lizard.collections.Widget = Backbone.Collection.extend({
  initialize: function() {
    console.log('Widget collection initializing');
  },
//   localStorage: new Backbone.LocalStorage("ddsc-widgets"),
  model: Lizard.models.Widget
});

Lizard.collections.Collage = Backbone.Collection.extend();

Lizard.collections.Timeseries = Backbone.Collection.extend({
  model: Lizard.models.Timeserie
});