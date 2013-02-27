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



Lizard.Models.WorkspaceItem = Backbone.AssociatedModel.extend({
  initialize: function(obj) {
    this.set('display_name', obj.wms_source.display_name);
    this.set('type', obj.wms_source.type);
    this.set('layer', new Lizard.Layers.WMSLayer(obj.wms_source));
  },

  defaults: {
    visibility: true
  }
});

Lizard.Models.Workspace = Backbone.AssociatedModel.extend({
  relations: [{
    type: Backbone.Many, //nature of the relationship
    key: 'workspaceitems', //attribute of collage relating to workspaceItems
    relatedModel: Lizard.Models.WorkspaceItem //AssociatedModel for attribute key
  }],
  defaults: {
    name: '',
    id: null,
    selected: false
  }
});

Lizard.Models.Favorite = Lizard.Models.Collage.extend();

Lizard.Models.Account = Backbone.Model.extend({
	url: settings.account_url,
	defaults: {
		authenticated: false,
	}
});

Lizard.Models.AccountToken = Backbone.Model.extend
