Lizard.Views.HomePageItem = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: '#homepage-item-template',
  events: {
    'click a': 'select'
  },
  select: function(e) {
    this.model.trigger('select_link_item', this.model);
  }
});


Lizard.Views.HomePageMapItem = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: '#homepage-item-map-template',
  events: {
    'click a': 'select'
  },
  select: function(e) {
    this.model.trigger('select_link_item', this.model);
  }
});

Lizard.Views.HomePageGraphItem = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: '#homepage-item-graph-template',
  events: {
    'click a': 'select'
  },
  select: function(e) {
    this.model.trigger('select_link_item', this.model);
  }
});



Lizard.Views.HomePageList = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Views.HomePageItem,
  collection: null, //workspaceCollection,
  tagName: 'ul',
  className: 'homepage-list',
  icon: "icon-globe",
  routerFunction: function() {}
});


//TODO: Deep linking is not yet implemented for HomePageMapList!!
Lizard.Views.HomePageMapList = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Views.HomePageMapItem,
  collection: null, //workspaceCollection,
  tagName: 'ul',
  className: 'homepage-list',
  icon: "icon-globe",
  routerFunction: function() {}
});

Lizard.Views.HomePageGraphList = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Views.HomePageGraphItem,
  collection: null, //workspaceCollection,
  tagName: 'ul',
  className: 'homepage-list',
  icon: "icon-globe",
  routerFunction: function() {}
});
