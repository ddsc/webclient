Lizard.models.Layer = Backbone.Model.extend({
	defaults: {
        layer_name: '',
        display_name: '',
        description: null,
        metadata: null,
        legend_url: null,
        enable_search: null,
        styles: null,
        format: null,
        height: null,
        width: null,
        tiled: null,
        transparent: null,
        wms_url: '',
        opacity: null,
        type: null
	},

		url: function() {
		var origUrl = Backbone.Model.prototype.url.call(this);
		return origUrl += _.last(origUrl) === '/' ? '' : '/'
	}
});
