/**
ItemViews
*/

Lizard.Views = {};


Lizard.Views.InfoModal = Backbone.Marionette.ItemView.extend({
  template: '#info-modal-template',
  initialize: function() {
    console.log('Lizard.Views.Info initializing');
  }
});


Lizard.Views.Filter = Backbone.Marionette.ItemView.extend({
  _modelBinder: undefined,
  initialize: function(){
    // console.log('FilterView.initialize()');
    this._modelBinder = new Backbone.ModelBinder();
    this.model.on('reset', this.render, this);
  },
  onRender: function() {
    // console.log('filterview onRender()');
    var bindings = {state: 'span.state'};
    this._modelBinder.bind(this.model, this.el, bindings);
  },
  tagName: 'li',
  template: '#filterview-template',
  events: {
    'click input': 'toggle'
  },
  toggle: function(e) {
    uuid = this.model.get('id');
    type = 'logicalgroups';
    Lizard.Utils.Workspace.toggleSelected(uuid, type);
  },
});

Lizard.Views.Location = Backbone.Marionette.ItemView.extend({
  _modelBinder: undefined,
  initialize: function(){
    // console.log('LocationView.initialize()');
    this._modelBinder = new Backbone.ModelBinder();
  },
  onRender: function() {
    // console.log('locationview onRender()');
    var bindings = {state: 'span.state'};
    this._modelBinder.bind(this.model, this.el, bindings);
    this._modelBinder._onElChanged(this);
  },
  tagName: 'li',
  template: '#locationview-template',
  events: {
    'click input': 'toggle'
  },
  toggle: function(e) {

  },
});

Lizard.Views.Parameter = Backbone.Marionette.ItemView.extend({

  _modelBinder: undefined,
  initialize: function(){
    this._modelBinder = new Backbone.ModelBinder();
  },
  onRender: function() {
    var bindings = {state: 'span.state'};
    this._modelBinder.bind(this.model, this.el, bindings);
  },
  tagName: 'li',
  className: '',
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
    'change:hidden': 'modelChanged'
  },
  modelChanged: function() {
    if (this.model.get('hidden') === true ) {
      this.$el._addClass("hidden");
    } else {
      this.$el._removeClass("hidden");
    }
  },
});

Lizard.Views.WidgetView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    // console.log('Lizard.Views.WidgetView initializing');
    that = this;
  },
  tagName: 'li',
  className: 'new',
  template: '#widgetview-template',
  attributes: {
    "data-col": "1", // << this needs to be dynamic!
    "data-row": "1",
    "data-sizex": "2",
    "data-sizey": "2"
  },
  events: {
    'click .icon-cog': 'configureWidget'
  },
  configureWidget: function(e) {
    // alert('test');
    // console.log(this.model.attributes.label + ' of ' + this.model.attributes.title);
    e.preventDefault();
    var template = _.template( $("#widget-configuration").html(), {} );
    this.$el.html( template );
  },
  modelEvents: {
    'change': 'modelChanged'
  },
  collectionEvents: {
    'add': 'modelAdded'
  },
  modelChanged: function() {
    console.log('modelChanged()');
  },
  modelAdded: function() {
    console.log('modelAdded()');
  }

});

Lizard.Views.FavoriteView = Backbone.Marionette.ItemView.extend({
  template:function(model){
    return _.template($('#favorite-item-template').html(), {
      name: model.data.name,
      uuid: model.data.timeserie
    }, {variable: 'favorite'});
  },
  onRender: function(){
    if (!window.mapCanvas){
      this.$el.find('.goto').toggle('hidden');
    }
  },
  tagName: 'li',
  events:{
    "click .goto": 'goTo',
    "click .favstar" : 'removeFav'
  },
  removeFav: function(){
    this.model.destroy({wait:true});
  },
  goTo: function(e){
    if (window.mapCanvas){
      var location = locationCollection.get(this.model.attributes.location);
      var point = location.attributes.point_geometry;
      window.mapCanvas.panTo(new L.LatLng(point[1], point[0]));
    }
  }
});

/**
CollectionViews
*/

Lizard.Views.FilterCollection = Backbone.Marionette.CollectionView.extend({
  collection: filterCollection,
  tagName: 'ul',
  itemView: Lizard.Views.Filter,

  initialize: function(){
     this.collection.fetch({
        cache: true
      });
      this.listenTo(this.collection, 'reset', this.render, this);
  }
});

Lizard.Views.LocationCollection = Backbone.Marionette.CollectionView.extend({
  collection: locationCollection,
  tagName: 'ul',
  itemView: Lizard.Views.Location,

  initialize: function(){
      this.collection.fetch({
        cache: true
      });
      this.listenTo(this.collection, 'reset', this.render, this);
  }
});

Lizard.Views.ParameterCollection = Backbone.Marionette.CollectionView.extend({
  collection: parameterCollection,
  tagName: 'ul',

  itemView: Lizard.Views.Parameter,

  initialize: function(){
      this.collection.fetch({
        cache: true
      });
      this.listenTo(this.collection, 'reset', this.render, this);
  }
});

Lizard.Views.WidgetCollectionView = Backbone.Marionette.CollectionView.extend({
  // Creates the Gridster UL element
  collection: new Lizard.Collections.Widget(),
  tagName: 'ul',
  className: 'gridster',
  itemView: Lizard.Views.WidgetView,

  initialize: function(){
    this.listenTo(this.collection, 'reset', this.render, this);
  },
  onShow: function() {
    var self = this;
    var gridster = $('.gridster').gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [140, 140],
        draggable: {
          stop: function(event, ui) {
            console.log('Syncing dashboard: ', gridster.serialize());
            $('.top-right').notify({message: {text: 'Saving your dashboard layout!'}}).show();
          }
        }
    }).data('gridster');

    _.each(self.collection.models, function(model) {
      var jg = new JustGage({
        id: model.attributes.gaugeId,
        value: getRandomInt(650, 980),
        min: 350,
        max: 980,
        title: model.attributes.title,
        label: model.attributes.label
      });
      setInterval(function() { // <-- commented during development...
        jg.refresh(getRandomInt(350,980));
      }, getRandomInt(2000,5000));
    });
  }
});


Lizard.Views.FavoriteCollection = Backbone.Marionette.CollectionView.extend({
  collection: favoriteCollection,
  tagName: 'ul',
  itemView: Lizard.Views.FavoriteView,
  initialize: function() {
    this.collection.fetch();
  }
});



/* LAYER VIEWS */
Lizard.Views.Layer = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  className: 'drawer-item',
  template: '#layeritem-template',
  initialize: function() {
    this.model.bind('change', this.render);
  },
  onBeforeRender: function(model) {
    // console.log('onBeforeRender', model);
  },
  events: {
    'click .layer-item .indicator': 'toggleVisibility'
  },
  toggleVisibility: function() {
    if(this.model.attributes.visibility) {
      this.model.set({ visibility: false });
    } else {
      this.model.set({ visibility: true });
    }
    console.log('Is this visible? ', this.model.attributes.visibility);
    // console.log(this.model);
  }
});

Lizard.Views.LayerList = Backbone.Marionette.CollectionView.extend({
  tagName: 'ol',
  className: 'ui-sortable drawer-group',
  itemView: Lizard.Views.Layer,
  onDomRefresh: function() {
    $('.drawer-group').sortable({
      'forcePlaceholderSize': true,
      'handle': '.handle',
      'axis': 'y'
    });
    $('.drawer-group').disableSelection();
  }
});


// Instantiate the Views
var filtercollectionview = new Lizard.Views.FilterCollection();
var favoritecollectionview = new Lizard.Views.FavoriteCollection();
var locationcollectionview = new Lizard.Views.LocationCollection();
var parametercollectionview = new Lizard.Views.ParameterCollection();
var widgetcollectionview = new Lizard.Views.WidgetCollectionView();

widgetcollectionview.collection.add([
  new Lizard.Models.Widget({col:3,row:5,size_x:2,size_y:2,gaugeId:1,title:'Amstel',label:'Verplaatsing (m/s)'}),
  new Lizard.Models.Widget({col:1,row:1,size_x:2,size_y:2,gaugeId:2,title:'Waternet',label:'Debiet (m3)'}),
  new Lizard.Models.Widget({col:3,row:3,size_x:2,size_y:2,gaugeId:3,title:'Rijn',label:'Volume (m3)'}),
  new Lizard.Models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:4,title:'Dijk 22',label:'Sulfiet'}),
  new Lizard.Models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:5,title:'Dijk 23',label:'Temperatuur (c)'}),
  new Lizard.Models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:6,title:'Dijk 24',label:'Druk'})
]);
