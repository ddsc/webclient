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

Lizard.Views.HomePageList = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Views.HomePageItem,
  collection: null, //workspaceCollection,
  tagName: 'ul',
  className: 'homepage-list',
  icon: "icon-globe",
  routerFunction: function() {}
});



