var Collage = new Lizard.Collections.Collage();

CollageItemView = Backbone.Marionette.ItemView.extend({
  template: '#collageitem-template',
  tagName: 'li',
  className: 'drawer-item collage-item',
  model: Lizard.Models.CollageModel,
  events: {
    "click .remove" : "removeItem",
    "click .toggle" : "toggleItem",
  },
  removeItem: function() {
    
    console.log(this.close());
  },
  toggleItem: function() {
    'ja'
  }
})
;
CollageView = Backbone.Marionette.CollectionView.extend({
  collection: Collage,
  itemView: CollageItemView,
  tagName:'ol',
  className: 'ui-sortable collage-group drawer-group',
  initialize: function() {
    
  },
});

collageView = new CollageView();
