Lizard.Views.GraphLegendNoItems = Backbone.Marionette.ItemView.extend({
    template: "#show-no-items-message-template"
});

Lizard.Views.GraphLegendItem = Backbone.Marionette.ItemView.extend({
    template: '#graphs-legend-template',
    events: {
        // disabled for now, as it also removes the item when dropping
        // on its own div
        'dragend': 'onDragEnd'
    },
    onDragEnd: function(e) {
        // remove the timeseries when dragged to another graph
        var self = this;
        var dataJson = e.originalEvent.dataTransfer.getData('Text');
        if (dataJson) {
            var data = JSON.parse(dataJson);
            var timeseries = new Lizard.Models.TimeseriesActual({url: data.url});
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
});

Lizard.Views.GraphLegendCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: Lizard.Views.GraphLegendItem,
    emptyView: Lizard.Views.GraphLegendNoItems,
    onShow: function(e) {
    }
});
