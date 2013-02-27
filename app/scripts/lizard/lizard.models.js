/**
Models
*/


Lizard.Models = {};

Lizard.Models.Filter = Backbone.Model.extend({
  defaults: {
    'selected':  false
  }
});

Lizard.Models.Location = Backbone.Model.extend({
  initialize: function(response) {
    this.url = response.url;
    this.id = response.uuid;
  },
  defaults: {
    'selected':  false
  },
});

Lizard.Models.Parameter = Backbone.Model.extend({
  defaults: {
    'selected':  false
  }
});

Lizard.Models.Timeserie = Backbone.Model.extend({
  initialize: function(response) {
    this.url = response.url;
    this.id = response.uuid;
  },
  defaults: {
    'selected':  false,
    'favorite': false
  }
});

Lizard.Models.Widget = Backbone.Model.extend({});

Lizard.Models.Collage = Backbone.Model.extend({
  defaults: {
    data: '',
    id: null
  },
  url: function() {
    var origUrl = Backbone.Model.prototype.url.call(this);
    return origUrl += _.last(origUrl) === '/' ? '' : '/';
  }
});

Lizard.Models.Layer = Backbone.Model.extend({
  defaults: {
        visibility: false,
        order: 0,

        layer_name: '',
        display_name: '',
        description: null,
        metadata: null,
        legend_url: null,
        enable_search: null,
        styles: null,
        format: 'image/png',
        height: null,
        width: null,
        tiled: null,
        transparent: true,
        wms_url: '',
        opacity: 100,
        type: null,
        addedToMap: false
  },
  getLeafletLayer: function() {
    if (!this.leafletLayer) {
      this.leafletLayer = L.tileLayer.wms(this.attributes.wms_url, {
        //zIndex: 100 - this.$el.index(), todo
        layers: this.attributes.layer_name,
        format: this.attributes.format,
        transparent: this.attributes.transparent,
        opacity: this.attributes.opacity,
        attribution: 'DDSC'
      });
    }
    return this.leafletLayer;
  }
});


Lizard.Models.Favorite = Lizard.Models.Collage.extend();

Lizard.Models.WorkspaceItem = Backbone.Model.extend();

Lizard.Models.Account = Backbone.Model.extend({
	url: settings.account_url,
	defaults: {
		authenticated: false,
	}
});

Lizard.Models.AccountToken = Backbone.Model.extend
