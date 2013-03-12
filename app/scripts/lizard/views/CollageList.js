Lizard.views.Collage = Backbone.Marionette.ItemView.extend({
    tagName: 'li',
    template: '#name-template-delete',
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

Lizard.views.CollageList = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.views.Collage,
  onItemRemoved: function(e) {
    console.log('item removed!!!!!!!!!!', e);
  }
});
