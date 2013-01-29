/**
ItemViews
*/

Lizard.Views = {};

Lizard.Views.FilterView = Backbone.Marionette.ItemView.extend({
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

Lizard.Views.LocationView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('LocationView.initialize()');
  },
  tagName: 'li',
  template: '#locationview-template'
});

Lizard.Views.ParameterView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('ParameterView.initialize()');
  },
  tagName: 'li',
  template: '#parameterview-template'
});


/**
CollectionViews
*/

Lizard.Views.FilterCollectionView = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.Collections.FilterCollection(),
  tagName: 'ul',
  
  itemView: Lizard.Views.FilterView,
  initialize: function(){
      this.collection.fetch();
      this.bindTo(this.collection, 'reset', this.render, this);
  }
});

Lizard.Views.LocationCollectionView = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.Collections.LocationCollection(),
  tagName: 'ul',
  
  itemView: Lizard.Views.LocationView,
  initialize: function(){
      this.collection.fetch();
      this.bindTo(this.collection, 'reset', this.render, this);
  }
});

Lizard.Views.ParameterCollectionView = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.Collections.ParameterCollection(),
  tagName: 'ul',
  
  itemView: Lizard.Views.ParameterView,
  initialize: function(){
      this.collection.fetch();
      this.bindTo(this.collection, 'reset', this.render, this);
  }
});