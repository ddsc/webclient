Lizard.collections.Layer = Backbone.Collection.extend({
	url: local_settings.layers_url,
	model: Lizard.models.Layer
});
