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
    // this.el.children[0].setAttribute('draggable', 'true');
    // this.el.children[0].setAttribute('ondragstart', 'drag(event)');
    // this.el.children[0].setAttribute('data-url', this.model.attributes.timeseries[0]);
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
    console.log('Setting ' + this.model.get('name') + ' to ' + this.model.get('selected'));
  },
  modelEvents: {
    'change': 'modelChanged'
  },
  collectionEvents: {
    'add': 'modelAdded'
  },
  modelChanged: function() {
    var ids = '';
    _.each(filtercollectionview.collection.models, function(data) {
      if(data.attributes.selected === true) {
        var id = data.attributes.url.split('/')[6]; // TODO: Complain to Berto that this ID needs to be an attribute in the API JSON
        ids = ids + id;
        ids = ids + ',';
        console.log(ids);
      }
    });
    ids = ids.substring(0, ids.length - 1);

    locationcollectionview.collection.url = settings.locations_url + '?filter='+ids;
    locationcollectionview.collection.fetch({
      cache: true,
      success: function() {
        // window.graphsView.locationsRegion.show(locationcollectionview.render());
        // window.graphsView.filtersRegion.show(filtercollectionview.render());
        // window.graphsView.parametersRegion.show(parametercollectionview.render());
        // ^^ not needed, marionette seems to take care of this
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

    // console.log(this.model.attributes.location +' changed to', this.model.attributes.selected);

    var ids = '';
    _.each(locationcollectionview.collection.models, function(data) {
      if(data.attributes.selected === true) {
        ids = ids + data.attributes.uuid;
        ids = ids + ',';
        console.log(ids);
      }
    });
    ids = ids.substring(0, ids.length - 1);

    parametercollectionview.collection.url = settings.parameters_url + '?location='+ids;
    parametercollectionview.collection.fetch({
      cache: true,
      success: function() {
        // window.graphsView.parametersRegion.show(parametercollectionview.render());
        // window.graphsView.filtersRegion.show(filtercollectionview.render());
        // window.graphsView.locationsRegion.show(locationcollectionview.render());
        // ^^ not needed, marionette seems to take care of this
      }
    });
    filtercollectionview.collection.url = settings.filters_url + '?location='+ids;
    filtercollectionview.collection.fetch({
      cache: true,
      success: function() {
        // window.graphsView.parametersRegion.show(parametercollectionview.render());
        // window.graphsView.filtersRegion.show(filtercollectionview.render());
        // window.graphsView.locationsRegion.show(locationcollectionview.render());
        // ^^ not needed, marionette seems to take care of this
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
    var ids = '';
    _.each(parametercollectionview.collection.models, function(data) {
      if(data.attributes.selected === true) {
        var id = data.attributes.url.split('/')[6]; // TODO: Complain to Berto that this ID needs to be an attribute in the API JSON
        ids = ids + id;
        ids = ids + ',';
        console.log('---------->', ids);
      }
    });
    ids = ids.substring(0, ids.length - 1);
    locationcollectionview.collection.url = settings.locations_url + '?parameter='+ids;
    locationcollectionview.collection.fetch({
      cache: true,
      success: function() {
        // window.graphsView.parametersRegion.show(parametercollectionview.render());
        // window.graphsView.filtersRegion.show(filtercollectionview.render());
        // window.graphsView.locationsRegion.show(locationcollectionview.render());
        // ^^ not needed, marionette seems to take care of this
      }
    });
  },
  modelAdded: function() {
    // console.log('modelAdded: ', this.model);
  }
});

Lizard.views.WidgetView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    // console.log('Lizard.views.WidgetView initializing');
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
    console.log($(e.currentTarget).parent().html("<h5>Configureer Widget</h5><form><checkbox name='d1' value='d1'>d1</checkbox></form>"));
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

Lizard.views.WidgetCollectionView = Backbone.Marionette.CollectionView.extend({
  // Creates the Gridster UL element
  collection: new Lizard.collections.Widget(),
  tagName: 'ul',
  className: 'gridster',
  itemView: Lizard.views.WidgetView,

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







// Instantiate the views
var filtercollectionview = new Lizard.views.FilterCollection();
var locationcollectionview = new Lizard.views.LocationCollection();
var parametercollectionview = new Lizard.views.ParameterCollection();
var widgetcollectionview = new Lizard.views.WidgetCollectionView();

widgetcollectionview.collection.add([
  new Lizard.models.Widget({col:3,row:5,size_x:2,size_y:2,gaugeId:1,title:'Amstel',label:'Verplaatsing (m/s)'}),
  new Lizard.models.Widget({col:1,row:1,size_x:2,size_y:2,gaugeId:2,title:'Waternet',label:'Debiet (m3)'}),
  new Lizard.models.Widget({col:3,row:3,size_x:2,size_y:2,gaugeId:3,title:'Rijn',label:'Volume (m3)'}),
  new Lizard.models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:4,title:'Dijk 22',label:'Sulfiet'}),
  new Lizard.models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:5,title:'Dijk 23',label:'Temperatuur (c)'}),
  new Lizard.models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:6,title:'Dijk 24',label:'Druk'})
]);
