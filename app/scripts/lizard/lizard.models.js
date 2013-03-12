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

Lizard.Models.Widget = Backbone.Model.extend({
  defaults: {
    col:3,
    row:1,
    size_x:2,
    size_y:2,
    //gaugeId:_.uniqueId('gauge_'), todo, add to initialisation
    title:'Title',
    label:'%',
    min:0,
    max:100,
    refreshRate: 50000
  }
});

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
    //temp until API is fixed. todo
    try {
      this.set('type', obj.wms_source.metadata.type);
    } catch(e) {

    }
    var layerClass = LAYER_CLASSES[this.get('type')];

    this.set('layer', new layerClass(obj.wms_source));
    this.get('layer').set('order', this.get('order'));
    this.on('change:opacity', function(model) {
      console.log('Change opacity of ', model);
    });
    this.on('change:order', function(model){
      model.get('layer').set('order',model.get('order'));
    });
  },
  defaults: {
    order: 0,
    opacity: 100,
    visibility: true,
    selected: false
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
    id: "",
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

// Lizard.Models.AccountToken = Backbone.Model.extend
