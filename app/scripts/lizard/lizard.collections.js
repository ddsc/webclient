/**
Collections
*/

Lizard.Collections = {};

Backbone.Collection.prototype.parse = function(response){
  return response.results;
}

/* MAP COLLECTIONS */
Lizard.Collections.Layer = Backbone.Collection.extend({
  url: settings.layers_url,
  model: Lizard.Models.Layer
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
  model: Lizard.Models.Collage,
});


/* TIMESERIES COLLECTIONS */
Lizard.Collections.Timeseries = Backbone.Collection.extend({
  url: settings.timeseries_url,
  model: Lizard.Models.Timeserie
});

Lizard.Collections.Favorite = Lizard.Collections.Collage.extend({
  model: Lizard.Models.Favorite,
 });

collageCollection = new Lizard.Collections.Collage();
favoriteCollection = new Lizard.Collections.Favorite();
filterCollection = new Lizard.Collections.Filter();
locationCollection = new Lizard.Collections.Location();
parameterCollection = new Lizard.Collections.Parameter();
timeseriesCollection = new Lizard.Collections.Timeseries();