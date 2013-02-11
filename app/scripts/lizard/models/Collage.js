Lizard.models.Collage = Backbone.Model.extend({
	defaults: {
		data: '',
		id: null
	},

	url: function() {
		var origUrl = Backbone.Model.prototype.url.call(this);
		return origUrl += _.last(origUrl) === '/' ? '' : '/'
	}

});
