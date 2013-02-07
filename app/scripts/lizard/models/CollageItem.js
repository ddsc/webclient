Lizard.models.CollageItem = Backbone.AssociatedModel.extend({
    defaults: {
        name: '',
        id: null
    },

	orig_url : Backbone.Model.prototype.url,

	// Method taken directly from backbone with two modifications
	// Add this.getAttr('url') and
	// add a slash at the end of the url

	url: function() {
		var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url')
			|| this.getAttr('url') || urlError();
		base += (base.charAt(base.length - 1) === '/' ? '' : '/')
		return base;
    }
});
