Lizard.Models.Graph = Backbone.Model.extend({
    initialize: function () {
        this.set('graphItems', new Lizard.Collections.GraphItem());
    },
    defaults: {
        graphItems: null
    }
});
