Lizard.Views.ScatterPlot = Backbone.Marionette.View.extend({
    tagName: 'div',
    className: 'graph',
    model: Lizard.Models.Graph,
    initialize: function (options) {
        this.account = options.account;
    },
    onShow: function (e) {
        var plot = this.$el.initializePlot({scatterplot: true});
        plot.observeGraphModel(this.model);
        this.plot = plot;
    },
    onClose: function (e) {
        if (this.plot) {
            this.plot.shutdown();
        }
    }
});
