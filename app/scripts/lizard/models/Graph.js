Lizard.Models.Graph = Backbone.Model.extend({
    initialize: function () {
        var graphItems = new Lizard.Collections.GraphItem();
        this.set('graphItems', graphItems);
        //graphItems.on('add remove reset', this.change, this);
    },
    change: function (e) {
        this.set('hasTwoItems', this.get('graphItems').length == 2);
    },
    defaults: {
        graphItems: null,
        hasTwoItems: false
    }
});
