Lizard.views.Layer = Backbone.Marionette.ItemView.extend({
	tagName: 'li',
	template: '#layer-template',
});

Lizard.views.LayerList = Backbone.Marionette.CollectionView.extend({
	itemView: Lizard.views.Layer,
});
