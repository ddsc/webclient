/*
- Application-wide models, collections, views
- Application() instantiation (Marionette)
- Main Region definition
- Marionette/Backbone routing
*/


/**
Models
*/

var FilterModel = Backbone.Model.extend({
  initialize: function() {
    console.log('FilterModel initializing');
  },
  defaults: {
    'selected':  false
  }
});

var LocationModel = Backbone.Model.extend({
  initialize: function(model) {
    console.log('LocationModel initializing');
    this.url = model.url;
    this.fetch();
  },
});

var ParameterModel = Backbone.Model.extend({
  initialize: function() {
    console.log('ParameterModel initializing');
  }
});

/**
Collections
*/

var FilterCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('FilterCollection initializing');
  },
  url: local_settings.filters_url,
  model: FilterModel
});

var LocationCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('LocationCollection initializing');
  },
  url: local_settings.locations_url,
  model: LocationModel,
  parse: function(res, xhr) {
    return res.results;
  }
});

var ParameterCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('ParameterCollection initializing');
  },
  url: local_settings.parameters_url,
  model: ParameterModel
});


/**
ItemViews
*/

var FilterView = Backbone.Marionette.ItemView.extend({
  _modelBinder: undefined,
  initialize: function(){
    console.log('FilterView.initialize()');
    this._modelBinder = new Backbone.ModelBinder();
  },
  onRender: function() {
    console.log('filterview onRender()');
    var bindings = {state: 'span.state'};
    this._modelBinder.bind(this.model, this.el, bindings);
    console.log(bindings);
  },
  tagName: 'li',
  template: '#filterview-template',
  events: {
    'click input': 'toggle'
  },
  toggle: function(e) {
    if(this.model.get('selected') === false) {
      this.model.set('selected', true);
    } else {
      this.model.set('selected', false);
    }
    console.log('Setting ' + this.model.get('filtername') + ' to ' + this.model.get('selected'));
  },
  modelEvents: {
    'change': 'modelChanged'
  },
  collectionEvents: {
    'add': 'modelAdded'
  },
  modelChanged: function() {
    console.log('I, MODEL, HAS CHANGED TO ', this.model.attributes.selected);
  },
  modelAdded: function() {
    console.log('I, COLLECTION, HAS CHANGED');
  }
});

var LocationView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('LocationView.initialize()');
  },
  tagName: 'li',
  template: '#locationview-template'
});

var ParameterView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('ParameterView.initialize()');
  },
  tagName: 'li',
  template: '#parameterview-template'
});


/**
CollectionViews
*/

var FilterCollectionView = Backbone.Marionette.CollectionView.extend({
  collection: new FilterCollection(),
  tagName: 'ul',
  
  itemView: FilterView,
  initialize: function(){
      this.collection.fetch();
      this.bindTo(this.collection, 'reset', this.render, this);
  }
});

var LocationCollectionView = Backbone.Marionette.CollectionView.extend({
  collection: new LocationCollection(),
  tagName: 'ul',
  
  itemView: LocationView,
  initialize: function(){
      this.collection.fetch();
      this.bindTo(this.collection, 'reset', this.render, this);
  }
});

var ParameterCollectionView = Backbone.Marionette.CollectionView.extend({
  collection: new ParameterCollection(),
  tagName: 'ul',
  
  itemView: ParameterView,
  initialize: function(){
      this.collection.fetch();
      this.bindTo(this.collection, 'reset', this.render, this);
  }
});



var filtercollectionview = new FilterCollectionView();
var locationcollectionview = new LocationCollectionView();
var parametercollectionview = new ParameterCollectionView();




// Instantiate the Application()
Lizard = new Backbone.Marionette.Application();

// Add regions for Lizards main interface (menu + content)
Lizard.addRegions({
  content: '#content',
  menu: '#menu'
});

// Start Backbone's url router
Lizard.on('initialize:after', function() {
  Backbone.history.start();
});
