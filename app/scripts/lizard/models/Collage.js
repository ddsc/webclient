Lizard.models.Collage = Backbone.Model.extend({
	urlRoot: local_settings.collages_url,
	defaults: {
		name: '',
		id: null
	}
});
