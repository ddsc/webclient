Lizard.Models.Annotation = Backbone.Model.extend({
    defaults: {
        url: null
    },
    url: function () {
        return this.get('url')
    }
});
