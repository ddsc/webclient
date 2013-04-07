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
    onDragover: function(e) {
    },
    onDragenter: function(e) {
    },
    onDrop: function(e) {
        e.preventDefault();
        // fetch and add the timeseries
        var self = this;
        var dataJson = e.originalEvent.dataTransfer.getData('Text');
        if (dataJson) {
            var data = JSON.parse(dataJson);
            var timeseries = new Lizard.Models.TimeseriesActual({url: data.url});
            timeseries.fetch({
                success: function (model, response) {
                    var item = new Lizard.Models.GraphItem({
                        timeseries: model
                    });
                    self.model.get('graphItems').add(item);
                }
            });
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
