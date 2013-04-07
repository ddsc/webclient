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
    onDragEnd: function (e) {
        // remove the timeseries when dragged to another graph
        var self = this;
        var dataJson = e.originalEvent.dataTransfer.getData('Text');
        if (dataJson) {
            var data = JSON.parse(dataJson);
            if (data.uuid) {
                this.model.collection.each(function (otherItem) {
                    if (otherItem.get('timeseries').get('uuid') == data.uuid) {
                        self.model.collection.remove(otherItem);
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
