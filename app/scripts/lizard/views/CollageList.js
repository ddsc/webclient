Lizard.Views.Collage = Backbone.Marionette.ItemView.extend({
    tagName: 'li',
    template: '#layeritem-template',
    events: {
      'click .collageItem': 'selectItem',
  		'click .icon-remove': 'removeItem'
    },
    selectItem: function() {
        this.trigger('selectItem', this.model);
    },

	removeItem: function() {
		this.model.destroy();
	}
});

Lizard.Views.CollageList = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Views.Collage,
  onItemRemoved: function(e) {
    console.log('item removed!!!!!!!!!!', e);
  }
});
