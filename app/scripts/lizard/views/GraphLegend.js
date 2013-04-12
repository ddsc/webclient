Lizard.Views.GraphLegendNoItems = Backbone.Marionette.ItemView.extend({
    template: "#show-no-items-message-template"
});

Lizard.Views.GraphLegendItem = Backbone.Marionette.ItemView.extend({
    template: '#graphs-legend-template',
    events: {
        // disabled for now, as it also removes the item when dropping
        // on its own div
        // 'dragend': 'onDragEnd'
        'mouseenter': 'onMouseEnter',
        'mouseleave': 'onMouseLeave',
        'click .delete': 'removeFromCollection'
    },
    onMouseEnter: function(e) {
        var that = this;
        that.$el.find('ul').first().toggleClass('hide', 'show');
    },
    onMouseLeave: function(e) {
        var that = this;
        that.$el.find('ul').first().toggleClass('hide', 'show');
    },
    removeFromCollection: function(e) {
        var self = this;
        self.model.collection.remove(self.model);
        return true;
    },
    onDragEnd: function(e) {
        // remove the timeseries when dragged to another graph
        var self = this;
        var uuid = e.originalEvent.dataTransfer.getData('Text');
        if (uuid) {
            var timeseries = timeseriesCollection.get(uuid);
            if (timeseries) {
                var item = new Lizard.Models.GraphItem({
                    timeseries: timeseries
                });
                this.model.collection.find(function (oldItem) {
                    if (oldItem.get('timeseries').get('uuid')) {
                        // remove the item from the current collection
                        self.model.collection.remove(oldItem);
                    }
                });
            }
        }
    }
});

Lizard.Views.GraphLegendCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: Lizard.Views.GraphLegendItem,
    emptyView: Lizard.Views.GraphLegendNoItems,
    onShow: function(e) {
    }
});
