Lizard.views.CollageItem = Backbone.Marionette.ItemView.extend({
    tagName: "li",
    template: '#name-checkbox',
		events: {
		'click .icon-remove': 'removeItem'
	},
	removeItem: function() {
		this.model.destroy();
		activeCollageView._collage_item_list.render();
	}
});

Lizard.views.CollageItemList = Backbone.Marionette.CollectionView.extend({
    itemView: Lizard.views.CollageItem,
});
