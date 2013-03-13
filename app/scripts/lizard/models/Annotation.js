Lizard.Models.Annotation = Backbone.Model.extend({
	url: function() {
		var origUrl = Backbone.Model.prototype.url.call(this);
		return origUrl += _.last(origUrl) === '/' ? '' : '/';
	}
});
