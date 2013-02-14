Lizard.views.Layer = Backbone.Marionette.ItemView.extend({
	tagName: 'li',
	className: 'drawer-item',
	template: '#layeritem-template',
	events: {
		'click .layer-item': 'clickLayer'
	},

	clickLayer: function() {
		console.log(this.model);

		console.log('clickLayer');


	}
});

Lizard.views.LayerList = Backbone.Marionette.CollectionView.extend({
	tagName: 'ol',
	className: 'ui-sortable drawer-group',
	itemView: Lizard.views.Layer,

	onDomRefresh: function() {
		$('.drawer-group').sortable({
			'forcePlaceholderSize': true,
			'handle': '.handle',
			'axis': 'y'
		});
		$('.drawer-group').disableSelection();
	}
});
