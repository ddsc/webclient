Lizard.models.Collage = Backbone.AssociatedModel.extend({
    relations: [{
        type: Backbone.Many, //nature of the relationship
        key: 'collageitems', //attribute of collage relating to workspaceItems
        relatedModel: Lizard.models.CollageItem //AssociatedModel for attribute key
    }],
	defaults: {
		name: '',
		id: null
	}
});
