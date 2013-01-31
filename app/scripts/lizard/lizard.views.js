/**
Itemviews
*/

Lizard.views = {};

Lizard.views.Filter = Backbone.Marionette.ItemView.extend({
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

Lizard.views.Location = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('LocationView.initialize()');
  },
  tagName: 'li',
  template: '#locationview-template'
});

Lizard.views.Parameter = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('ParameterView.initialize()');
  },
  tagName: 'li',
  template: '#parameterview-template'
});


/**
Collectionviews
*/

Lizard.views.FilterCollection = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.collections.Filter(),
  tagName: 'ul',
  
  itemView: Lizard.views.Filter,
  initialize: function(){
      this.collection.fetch();
      this.listenTo(this.collection, 'reset', this.render, this);
  }
});

Lizard.views.LocationCollection = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.collections.Location(),
  tagName: 'ul',
  
  itemView: Lizard.views.Location,
  initialize: function(){
      this.collection.fetch();
      this.listenTo(this.collection, 'reset', this.render, this);
  }
});

Lizard.views.ParameterCollection = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.collections.Parameter(),
  tagName: 'ul',
  
  itemView: Lizard.views.Parameter,
  initialize: function(){
      this.collection.fetch();
      this.listenTo(this.collection, 'reset', this.render, this);
  }
});