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
    this.close();
  },
  toggleItem: function() {
    (this.model.attributes.incollage ? 
      this.model.set({incollage: false}) : 
      this.model.set({incollage: true}));
    this.$('.icon-ok').toggleClass('hidden');
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