Lizard.Views.GraphLegendNoItems = Backbone.Marionette.ItemView.extend({
    template: "#show-no-items-message-template"
});

Lizard.Views.GraphLegendItem = Backbone.Marionette.ItemView.extend({
    template: '#graphs-legend-template',
    events: {
        'dragend': 'onDragEnd',
        'click': 'onClick',
        // 'mouseleave': 'onMouseLeave',
        'click .delete': 'removeFromCollection',
        'click .annotate': 'openAnnotation'
    },
    onClick: function(e) {
        var that = this;
        that.$el.find('ul').first().toggleClass('hide', 'show');
    },
    removeFromCollection: function(e) {
        var self = this;
        self.model.collection.remove(self.model);
        return true;
    },
    openAnnotation: function(){
        var timeseriesInstance = this.model.get('timeseries');
        Lizard.App.vent.trigger('makeAnnotation', timeseriesInstance);
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

Lizard.Views.GraphLegendCollection = Backbone.Marionette.CollectionView.extend({
    itemView: Lizard.Views.GraphLegendItem,
    emptyView: Lizard.Views.GraphLegendNoItems
});
