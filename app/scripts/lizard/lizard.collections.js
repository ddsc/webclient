/**
Collections
*/

Lizard.Collections = {};

Backbone.Collection.prototype.parse = function(response){
  return response.results;
};

/* MAP COLLECTIONS */
Lizard.Collections.Layer = Backbone.Collection.extend({
  url: settings.layers_url,
  model: Lizard.Layers.WMSLayer,
});




/* FILTER/LOCATION/PARAMETER COLLECTIONS */
Lizard.Collections.Filter = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Filter collection initializing');
  },
  url: settings.filters_url,
  model: Lizard.Models.Filter
});

Lizard.Collections.Location = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Location collection initializing');
  },
  url: settings.locations_url,
  model: Lizard.Models.Location
});

Lizard.Collections.Parameter = Backbone.Collection.extend({
  initialize: function() {
    console.log('Parameter initializing');
  },
  url: settings.parameters_url,
  model: Lizard.Models.Parameter
});


/* WIDGET COLLECTIONS */
Lizard.Collections.Widget = Backbone.Collection.extend({
  initialize: function() {
    console.log('Widget collection initializing');
  },
  model: Lizard.Models.Widget
});


/* COLLAGE COLLECTIONS */
Lizard.Collections.Collage = Backbone.Collection.extend({
  url: settings.collages_url,
  model: Lizard.Models.Collage
});


/* TIMESERIES COLLECTIONS */

Lizard.Collections.InfiniteTimeseries = Backbone.Collection.extend({
  url: function() {
    return 'http://api.dijkdata.nl/api/v0/timeseries/?page=' + this.page;
  },
  parse: function(resp, xhr) {
    return resp.results;
  },
  page: 1
});

Lizard.Collections.Timeseries = Backbone.Collection.extend({
  initialize: function(){
   this.fetch({
      cache: false
    });
  },
  url: settings.timeseries_url,
  model: Lizard.Models.Timeserie
});

Lizard.Collections.Favorite = Lizard.Collections.Collage.extend({
  model: Lizard.Models.Favorite
 });

Lizard.Collections.Workspace = Backbone.Collection.extend({
  model: Lizard.Models.Workspace,
  url: settings.workspace_url
});



collageCollection = new Lizard.Collections.Collage();
favoriteCollection = new Lizard.Collections.Favorite();
filterCollection = new Lizard.Collections.Filter();
locationCollection = new Lizard.Collections.Location();
parameterCollection = new Lizard.Collections.Parameter();
timeseriesCollection = new Lizard.Collections.Timeseries();
infinitetimeseries = new Lizard.Collections.InfiniteTimeseries();