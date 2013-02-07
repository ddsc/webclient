Lizard.collections.CollageItem = Backbone.Collection.extend({
	url: local_settings.collageitems_url,
	model: Lizard.models.CollageItem
});
