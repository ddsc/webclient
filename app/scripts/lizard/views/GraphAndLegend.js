Lizard.Views.GraphAndLegendView = Backbone.Marionette.Layout.extend({
    template: '#graph-and-legend-template',
    events: {
        'dragover': function () {return false;},
        'dragenter': function () {return false;},
        'drop': 'onDrop'
    },
    regions: {
        legend: ".legend"
    },
    onDrop: function(e) {
        e.preventDefault();
        // add the timeseries
        var self = this;
        var uuid = e.originalEvent.dataTransfer.getData('Text');
        if (uuid) {
            var timeseries = timeseriesCollection.get(uuid);
            if (timeseries) {
                var item = new Lizard.Models.GraphItem({
                    timeseries: timeseries
                });
                this.model.get('graphItems').add(item);
            }
        }
    },
    onShow: function(e) {
        var plot = this.$el.find('.graph').initializePlot();
        plot.observeCollection(this.model.get('graphItems'));

        var legendView = new Lizard.Views.GraphLegendCollectionView({
            collection: this.model.get('graphItems')
        });
        this.legend.show(legendView);
    }
});
