/**
ItemViews
*/

Lizard.Views = {};



Lizard.Views.Layer = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: '#layeritem-template',
  initialize: function() {
    this.model.bind('change', this.render);
  },
  events: {
    'click .icon-circle-arrow-up': 'moveUp',
    'click .icon-circle-arrow-down': 'moveDown',
    'click .indicator': 'toggleVisibility'
  },
  moveUp: function(event) {
    console.log('moveUp!', this.model.get('display_name'));
  },
  moveDown: function(event) {
    console.log('moveDown!', this.model.get('display_name'));
  },
  toggleVisibility: function(event) {
    console.log('Toggle!', this.model.get('display_name'));
  },
  onBeforeRender: function(model) {
    // console.log('onBeforeRender', model);
  }
});



Lizard.Views.InfoModal = Backbone.Marionette.ItemView.extend({
  template: '#info-modal-template',
  initialize: function() {
    console.log('Lizard.Views.Info initializing');
  }
});

Lizard.Views.ItemView = Backbone.Marionette.ItemView.extend({
  _modelBinder: undefined,
  initialize: function(){
    this._modelBinder = new Backbone.ModelBinder();
    this.model.on('reset', this.render, this);
  },
  onRender: function() {
    var bindings = {state: 'span.state'};
    this._modelBinder.bind(this.model, this.el, bindings);
  },
  tagName: 'li'
});

Lizard.Views.Filter = Lizard.Views.ItemView.extend({
  template: '#filterview-template',
  events: {
    'click input': 'toggle'
  },
  toggle: function(e) {
    uuid = this.model.get('id');
    type = 'logicalgroups';
    Lizard.Utils.Favorites.toggleSelected(uuid, type);
  },
});

Lizard.Views.Location = Lizard.Views.ItemView.extend({
  template: '#locationview-template',
  events: {
    'click input': 'toggle'
  },
  toggle: function(e) {
  }
});

Lizard.Views.Parameter = Lizard.Views.ItemView.extend({
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
      uuid: "fav" + model.data.timeserie
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

Lizard.Views.CollectionView = Backbone.Marionette.CollectionView.extend({
  tagName: 'ul',
  initialize: function(){
   this.collection.fetch({
      cache: false
    });
    this.listenTo(this.collection, 'reset', this.render, this);
  }
});

Lizard.Views.FilterCollection = Lizard.Views.CollectionView.extend({
  collection: filterCollection,
  itemView: Lizard.Views.Filter,
});

Lizard.Views.LocationCollection = Backbone.Marionette.CollectionView.extend({
  collection: locationCollection,
  itemView: Lizard.Views.Location,
});

Lizard.Views.ParameterCollection = Backbone.Marionette.CollectionView.extend({
  collection: parameterCollection,
  itemView: Lizard.Views.Parameter,
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


Lizard.Views.FavoriteCollection = Lizard.Views.CollectionView.extend({
  collection: favoriteCollection,
  itemView: Lizard.Views.FavoriteView,
  initialize: function() {
    this.collection.fetch();
  }
});



Lizard.Views.LayerCollection = Backbone.Marionette.CollectionView.extend({
  collection: layerCollection,
  itemView: Lizard.Views.Layer,
  initialize: function() {
    this.collection.fetch();
  }
});

/* LAYER VIEWS */
Lizard.Views.Layer = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  className: 'drawer-item',
  template: '#layeritem-template',
  initialize: function () {
    this.model.bind('change', this.render);
  },
  onBeforeRender: function () {
    this.el.setAttribute("id", this.model.attributes.display_name);
  },
  events: {
    'click .layer-item .indicator': 'toggleVisibility'
  },
  toggleVisibility: function () {
    if(this.model.attributes.visibility) {
      this.model.set({ visibility: false });
      window.mapCanvas.removeLayer(this.model.attributes.lyr);
    } else {
      this.model.set({ visibility: true });
      var lyr = L.tileLayer.wms(this.model.attributes.wms_url, {
        zIndex: 100 - this.$el.index(),
        layers: this.model.attributes.layer_name,
        format: this.model.attributes.format,
        transparent: this.model.attributes.transparent,
        opacity: this.model.attributes.opacity,
        attribution: 'DDSC'
      });
      this.model.set({lyr: lyr});
      window.mapCanvas.addLayer(lyr);
    }
  },
  updateOrder: function() {

    console.log($(this.model.attributes.display_name).index());
  }
});

Lizard.Views.LayerList = Backbone.Marionette.CollectionView.extend({
  initialize: function () {
    this.collection.fetch();
  },
  collection: layerCollection,
  tagName: 'ol',
  className: 'ui-sortable drawer-group',
  itemView: Lizard.Views.Layer,
  onDomRefresh: function () {
    $('.drawer-group').sortable({
      'forcePlaceholderSize': true,
      'handle': '.handle',
      'axis': 'y',
      update: function (event, ui) {
        model = layerCollection.where({display_name: ui.item[0].id})[0];
        model.attributes.lyr.setZIndex(100 - ui.item.index())
      }
    });
    $('.drawer-group').disableSelection();
  }
});


/* MENU VIEWS */

Lizard.Views.Menu = Backbone.Marionette.ItemView.extend({
	model: new Lizard.Models.Account(),
	tagName: 'a',
	template: '#login-template',
    attributes: {
		'href': '#'},

	events: {
		'click #login': 'doLogin',
		'click #logout': 'doLogout'
	},

	initialize: function(){
		console.log('initialize LoginView');
		var that = this;
		this.model.fetch({
			success: function(model, response, data){
				if (model.attributes.authenticated === true){
					that.template = '#loggedin-template';
					that.render();
				}
			}
		});
	},

	doLogin: function(e){
		// Redirect to the Single Sign On server.
		e.preventDefault();
		url = settings.login_token_url;
		$.getJSON(url, function(json) {
			window.location=json.login_url;
		});
	},

	doLogout: function(e){
		// Redirect to the Single Sign On server.
		e.preventDefault();
		url = settings.logout_token_url;
		$.getJSON(url, function(json) {
			window.location=json.logout_url;
		});
	}

});



// Instantiate the Views
var filtercollectionview = new Lizard.Views.FilterCollection();
var favoritecollectionview = new Lizard.Views.FavoriteCollection();
var locationcollectionview = new Lizard.Views.LocationCollection();
var parametercollectionview = new Lizard.Views.ParameterCollection();
var layercollectionview = new Lizard.Views.LayerCollection();
var widgetcollectionview = new Lizard.Views.WidgetCollectionView();

widgetcollectionview.collection.add([
  new Lizard.Models.Widget({col:3,row:5,size_x:2,size_y:2,gaugeId:1,title:'Amstel',label:'Verplaatsing (m/s)'}),
  new Lizard.Models.Widget({col:1,row:1,size_x:2,size_y:2,gaugeId:2,title:'Waternet',label:'Debiet (m3)'}),
  new Lizard.Models.Widget({col:3,row:3,size_x:2,size_y:2,gaugeId:3,title:'Rijn',label:'Volume (m3)'}),
  new Lizard.Models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:4,title:'Dijk 22',label:'Sulfiet'}),
  new Lizard.Models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:5,title:'Dijk 23',label:'Temperatuur (c)'}),
  new Lizard.Models.Widget({col:3,row:1,size_x:2,size_y:2,gaugeId:6,title:'Dijk 24',label:'Druk'})
]);
