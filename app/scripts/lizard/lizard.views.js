/**
ItemViews
*/

Lizard.views = {};

Lizard.views.Filter = Backbone.Marionette.ItemView.extend({
  _modelBinder: undefined,
  initialize: function(){
    // console.log('FilterView.initialize()');
    this._modelBinder = new Backbone.ModelBinder();
  },
  onRender: function() {
    // console.log('filterview onRender()');
    var bindings = {state: 'span.state'};
    this._modelBinder.bind(this.model, this.el, bindings);
    // console.log(bindings);
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

    console.log(this.model.attributes.filtername +' changed to', this.model.attributes.selected);

    var ids = '';
    _.each(filtercollectionview.collection.models, function(data) {
      if(data.attributes.selected === true) {
        ids = ids + data.attributes.filter_id;
        ids = ids + ',';
        // console.log(ids);
      }
    });
    ids = ids.substring(0, ids.length - 1);

    locationcollectionview.collection.url = settings.locations_url + '?filters='+ids;
    locationcollectionview.collection.fetch({
      cache: true,
      success: function() {
        window.graphsView.locationsRegion.show(locationcollectionview.render());
      }
    });

  },
  modelAdded: function() {
    console.log('A model was added to the collection');
  }
});


Lizard.views.Location = Backbone.Marionette.ItemView.extend({

  _modelBinder: undefined,
  initialize: function(){
    // console.log('LocationView.initialize()');
    this._modelBinder = new Backbone.ModelBinder();
  },
  onRender: function() {
    // console.log('locationview onRender()');
    var bindings = {state: 'span.state'};
    this._modelBinder.bind(this.model, this.el, bindings);
    // console.log(bindings);
  },
  tagName: 'li',
  template: '#locationview-template',
  events: {
    'click input': 'toggle'
  },
  toggle: function(e) {
    if(this.model.get('selected') === false) {
      this.model.set('selected', true);
    } else {
      this.model.set('selected', false);
    }
  },
  modelEvents: {
    'change': 'modelChanged'
  },
  collectionEvents: {
    'add': 'modelAdded'
  },
  modelChanged: function() {

    console.log(this.model.attributes.location +' changed to', this.model.attributes.selected);

    var ids = '';
    _.each(locationcollectionview.collection.models, function(data) {
      if(data.attributes.selected === true) {
        ids = ids + data.attributes.location_id;
        ids = ids + ',';
        // console.log(ids);
      }
    });
    ids = ids.substring(0, ids.length - 1);

    parametercollectionview.collection.url = settings.parameters_url + '?locations='+ids;
    parametercollectionview.collection.fetch({
      cache: true,
      success: function() {
        window.graphsView.parametersRegion.show(parametercollectionview.render());
      }
    });
    filtercollectionview.collection.url = settings.filters_url + '?locations='+ids;
    filtercollectionview.collection.fetch({
      cache: true,
      success: function() {
        window.graphsView.filtersRegion.show(filtercollectionview.render());
      }
    });

  },
  modelAdded: function() {
    console.log('I, COLLECTION, HAS CHANGED');
  }

});

Lizard.views.Parameter = Backbone.Marionette.ItemView.extend({
  
  _modelBinder: undefined,
  initialize: function(){
    // console.log('ParameterView.initialize()');
    this._modelBinder = new Backbone.ModelBinder();
  },
  onRender: function() {
    // console.log('parameterview onRender()');
    var bindings = {state: 'span.state'};
    this._modelBinder.bind(this.model, this.el, bindings);
    // console.log(bindings);
  },
  tagName: 'li',
  template: '#parameterview-template',
  events: {
    'click input': 'toggle'
  },
  toggle: function(e) {
    if(this.model.get('selected') === false) {
      this.model.set('selected', true);
    } else {
      this.model.set('selected', false);
    }
  },
  modelEvents: {
    'change': 'modelChanged'
  },
  collectionEvents: {
    'add': 'modelAdded'
  },
  modelChanged: function() {
    console.log(this.model.attributes.filtername +' changed to', this.model.attributes.selected);
    var ids = '';
    _.each(parametercollectionview.collection.models, function(data) {
      if(data.attributes.selected === true) {
        ids = ids + data.attributes.parameter_id;
        ids = ids + ',';
        // console.log('---------->', ids);
      }
    });
    ids = ids.substring(0, ids.length - 1);
    locationcollectionview.collection.url = settings.locations_url + '?parameters='+ids;
    locationcollectionview.collection.fetch({
      cache: true,
      success: function() {
        window.graphsView.locationsRegion.show(locationcollectionview.render());
      }
    });
  },
  modelAdded: function() {
    console.log('modelAdded: ', this.model);
  }
});


/**
CollectionViews
*/

Lizard.views.FilterCollection = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.collections.Filter(),
  tagName: 'ul',
  itemView: Lizard.views.Filter,

  initialize: function(){
     this.collection.fetch({
        cache: true
      });
      this.listenTo(this.collection, 'reset', this.render, this);
  }
});

Lizard.views.LocationCollection = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.collections.Location(),
  tagName: 'ul',
  itemView: Lizard.views.Location,

  initialize: function(){
      this.collection.fetch({
        cache: true
      });
      this.listenTo(this.collection, 'reset', this.render, this);
  }
});

Lizard.views.ParameterCollection = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.collections.Parameter(),
  tagName: 'ul',

  itemView: Lizard.views.Parameter,

  initialize: function(){
      this.collection.fetch({
        cache: true
      });
      this.listenTo(this.collection, 'reset', this.render, this);
  }
});


// Instantiate the views
var filtercollectionview = new Lizard.views.FilterCollection();
var locationcollectionview = new Lizard.views.LocationCollection();
var parametercollectionview = new Lizard.views.ParameterCollection();
