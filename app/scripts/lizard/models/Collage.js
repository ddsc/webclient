Lizard.models.Collage = Backbone.AssociatedModel.extend({
	urlRoot: local_settings.collages_url,
    relations: [{
        type: Backbone.Many, //nature of the relationship
        key: 'items', //attribute of collage relating to workspaceItems
        relatedModel: Lizard.models.CollageItem //AssociatedModel for attribute key
    }],
	defaults: {
		name: '',
		id: null
	}
});
