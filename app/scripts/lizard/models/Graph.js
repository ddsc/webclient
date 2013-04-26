Lizard.Models.Graph = Backbone.Model.extend({
    initialize: function (options) {
        var graphItems = new Lizard.Collections.GraphItem();
        this.set({
            graphItems: graphItems,
            dateRange: options.dateRange
        });
        graphItems.on('add remove reset', this.onGraphItemsChange, this);
    },
    teardown: function () {
        var graphItems = this.get('graphItems');
        graphItems.off('add remove reset', this.onGraphItemsChange, this);
    },
    onGraphItemsChange: function (e) {
        this.set('hasTwoItems', this.get('graphItems').length == 2);
    },
    defaults: {
        graphItems: null,
        hasTwoItems: false,
        dateRange: null
    }
});
