Lizard.collections.Layer = Backbone.Collection.extend({
	parse: function(response){
		return response.results
	},

	url: settings.layers_url,
	model: Lizard.models.Layer
});
