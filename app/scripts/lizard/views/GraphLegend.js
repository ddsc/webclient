Lizard.Views.GraphLegendNoItems = Backbone.Marionette.ItemView.extend({
    template: "#show-no-items-message-template"
});

Lizard.Views.GraphLegendItem = Backbone.Marionette.ItemView.extend({
    template: '#graphs-legend-template',
    initialize: function () {
        this.model.set('draggable', this.model.collection.draggable);
    },
    events: {
        'dragend': 'onDragEnd',
        'click': 'onClick',
        // 'mouseleave': 'onMouseLeave',
        'click .delete': 'removeFromCollection',
        'click .annotate': 'openAnnotation',
        'click .csv-link': 'redirectToCsv'
    },
    onClick: function(e) {
        e.preventDefault();
        this.$el.find('ul').first().toggleClass('hide', 'show');
    },
    removeFromCollection: function(e) {
        e.preventDefault();
        this.model.collection.remove(this.model);
    },
    openAnnotation: function(e){
        e.preventDefault();
        var timeseriesInstance = this.model.get('timeseries');
        Lizard.Views.CreateAnnotationView(timeseriesInstance);
    },
    redirectToCsv: function (e) {
        e.preventDefault();
        var url = this.model.get('timeseries').get('url') + 'data/';
        var params = {
            format: 'csv'
        };
        var dateRange = this.model.collection.graphModel.get('dateRange');
        var start = dateRange.get('start');
        var end = dateRange.get('end');
        if (start) {
            params.start = start.toJSON();
        }
        if (end) {
            if (moment.isMoment(end)) { end = end.toDate(); }
            params.end = end.toJSON();
        }
        url += '?' +$.param(params);
        window.location = url;
    },
    onDragEnd: function (e) {
        // remove the timeseries when dragged to another graph
        var self = this;
        var data = null;
        var dataJson = e.originalEvent.dataTransfer.getData('Text');
        if (dataJson) {
            data = JSON.parse(dataJson);
        }
        else {
            // for some reason Google Chrome won't let us read the dataTransfer object
            data = $(e.target).data();
        }
        if (data) {
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
