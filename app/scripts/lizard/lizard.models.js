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
    type: 'gage', //template
    title:'Title',
    //gaugeId:_.uniqueId('gauge_'), todo, add to initialisation
    label:'%',
    min:0,
    max:100,
    refreshRate: 50000
  },
  initialize: function(obj) {

    if (!obj.widgetId) {
      this.set({ widgetId: _.uniqueId('widget_')});
    }
  }
});

Lizard.Models.CollageItem = Backbone.AssociatedModel.extend({
  defaults: {
    graph_index: 0,
    timeseries: []
  }
});

Lizard.Models.Collage = Backbone.AssociatedModel.extend({
  relations: [{
    type: Backbone.Many, //nature of the relationship
    key: 'collageitems', //attribute of collage relating to workspaceItems
    relatedModel: Lizard.Models.CollageItem //AssociatedModel for attribute key
  }],
  defaults: {
    name: '',
    id: null,
    selected: false,
    icon: 'icon-globe'
  },
  url: function() {
    var origUrl = Backbone.Model.prototype.url.call(this);
    return origUrl += _.last(origUrl) === '/' ? '' : '/';
  }
});



Lizard.Models.WorkspaceItem = Backbone.AssociatedModel.extend({
  initialize: function(obj) {
    this.set('display_name', obj.wms_source.display_name);
    this.set('opacity', obj.wms_source.options.opacity*100);
    this.set('type', obj.wms_source.type);
    try {
      if (obj.wms_source.options.type) {
        this.set('type', obj.wms_source.options.type);
      }
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
    id: null,
    selected: false,
    icon: 'icon-globe'
  }
});

Lizard.Models.Favorite = Lizard.Models.Collage.extend(); //todo: ??

Lizard.Models.Account = Backbone.Model.extend({
  url: settings.account_url,
  defaults: {
    authenticated: false,
    initialZoom: '5.16082763671875,51.95442214470791,7',//todo: use for initialisation of map
    initialPeriod: '1m'//todo: what is a good period notation //todo: use for initialisation of graphs
  }
});

Lizard.Models.CurrentState = Backbone.Model.extend({
  //url: settings.account_url,
  defaults: {
    alarms: 2,
    storingen: 5,//todo: use for initialisation of map
    activeSensors: 102 ,//todo: what is a good period notation //todo: use for initialisation of graphs
    newMeasurementsLastHour: 1811
  }
});

Lizard.Models.LiveFeed = Backbone.Model.extend({
  //url: settings.account_url,
  defaults: {
    icon: 'icon-globe',
    title: 'Melding',
    text: '...',
    time: 'gisteren',
    href: '#'
  }
});
