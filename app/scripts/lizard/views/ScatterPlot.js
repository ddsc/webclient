Lizard.Views.ScatterPlot = Backbone.Marionette.View.extend({
    tagName: 'div',
    className: 'graph',
    model: Lizard.Models.Graph,
    initialize: function (options) {
        this.account = options.account;
    },
    onShow: function (e) {
        var plot = this.$el.initializePlot({scatterplot: true});
        var url = this.model.get('graphItems').models[0].get('timeseries').get('events');
        var combine_with_uuid = this.model.get('graphItems').models[1].get('timeseries').get('uuid');
        plot.loadScatterPlotData(url, combine_with_uuid);
        this.plot = plot;
    },
    onClose: function (e) {
        if (this.plot) {
            this.plot.shutdown();
        }
    }
});
