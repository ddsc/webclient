Lizard.Collage = {};

var Collage = new Lizard.Collections.Collage();

CollageItemView = Backbone.Marionette.ItemView.extend({
  template: '#collageitem-template',
  tagName: 'li',
  className: 'drawer-item collage-item',
  model: Lizard.Models.Collage,
  events: {
    "click .remove" : "removeItem",
    "click .toggle" : "toggleItem",
  },
  removeItem: function() {
    this.close();
  },
  toggleItem: function() {
    var item = (this.model.attributes.incollage ? this.model.set({incollage: false}) : this.model.set({incollage: true}));
    this.$('.icon-ok').toggleClass('hidden');
    return item;
  }
});

CollageView = Backbone.Marionette.CollectionView.extend({
  collection: Collage,
  itemView: CollageItemView,
  tagName:'ol',
  className: 'ui-sortable collage-group drawer-group',
  initialize: function() {
    
  },
});

Lizard.Collage.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#collage-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion',
    'collageRegion': '#collageRegion'
  }
});


Lizard.Collage.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'collage': 'collage'
    }
});


Lizard.Collage.collage = function(){
  console.log('Lizard.Collage.collage()');

  // Instantiate Collage's default layout
  var collageView = new Lizard.Collage.DefaultLayout();
  
  Lizard.App.content.show(collageView);
  // var collageView = new CollageView();


  window.collageView = collageView; // so it's available outside this controller

  // And set URL to #graphs
  Backbone.history.navigate('collage');
};

Lizard.App.addInitializer(function(){
  Lizard.Collage.router = new Lizard.Collage.Router({
    controller: Lizard.Collage
  });
  
  Lizard.App.vent.trigger('routing:started');
});









