/**
Collections
*/

Lizard.collections = {};


/* MAP COLLECTIONS */
Lizard.collections.Layer = Backbone.Collection.extend({
  parse: function(response){
    return response.results;
  },
  url: settings.layers_url,
  model: Lizard.models.Layer
});




/* FILTER/LOCATION/PARAMETER COLLECTIONS */
Lizard.collections.Filter = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Filter collection initializing');
  },
  parse: function(response){
    return response.results;
  },
  url: settings.filters_url,
  model: Lizard.models.Filter
});

Lizard.collections.Location = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Location collection initializing');
  },
  parse: function(response){
    return response.results;
  },
  url: settings.locations_url,
  model: Lizard.models.Location
});

Lizard.collections.Parameter = Backbone.Collection.extend({
  initialize: function() {
    console.log('Parameter initializing');
  },
  parse: function(response){
    return response.results;
  },
  url: settings.parameters_url,
  model: Lizard.models.Parameter
});


/* WIDGET COLLECTIONS */
Lizard.collections.Widget = Backbone.Collection.extend({
  initialize: function() {
    console.log('Widget collection initializing');
  },
  parse: function(response){
    return response.results;
  },
  model: Lizard.models.Widget
});


/* COLLAGE COLLECTIONS */
Lizard.collections.Collage = Backbone.Collection.extend();


/* TIMESERIES COLLECTIONS */
Lizard.collections.Timeseries = Backbone.Collection.extend({
  parse: function(response){
    return response.results;
  },
  url: settings.timeseries_url,
  model: Lizard.models.Timeserie
});

Lizard.collections.Workspace = Backbone.Collection.extend({
  model: Lizard.models.WorkspaceItem,
});

WorkspaceCollection = new Lizard.collections.Workspace();