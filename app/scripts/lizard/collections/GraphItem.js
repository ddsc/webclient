Lizard.Collections.GraphItem = Backbone.Collection.extend({
    model: Lizard.Models.GraphItem,
    // ensure uniqueness of added timeseries
    add: function (graphItem) {
        var isDupe = this.any(function(_graphItem) {
            return _graphItem.get('timeseries').get('uuid') === graphItem.get('timeseries').get('uuid');
        });
        if (isDupe) {
            // ignore the item
            return false;
        }
        Backbone.Collection.prototype.add.call(this, graphItem);
    }
});
