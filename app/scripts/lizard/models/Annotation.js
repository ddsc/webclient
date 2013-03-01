Lizard.models.Annotation = Backbone.Model.extend({
	defaults: {
	},
	url: function() {
		var origUrl = Backbone.Model.prototype.url.call(this);
		return origUrl += _.last(origUrl) === '/' ? '' : '/';
	}

});
