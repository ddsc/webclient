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




Lizard.Models.Favorite = Lizard.Models.Collage.extend();

Lizard.Models.WorkspaceItem = Backbone.Model.extend();

Lizard.Models.Account = Backbone.Model.extend({
	url: settings.account_url,
	defaults: {
		authenticated: false,
	}
});

Lizard.Models.AccountToken = Backbone.Model.extend
