Lizard.Views.Graph = Backbone.Marionette.View.extend({
    tagName: 'div',
    className: 'graph',
    model: Lizard.Models.Graph,
    initialize: function (options) {
        this.account = options.account;
    },
    onShow: function (e) {
        var plot = this.$el.initializePlot();
        plot.observeCollection(this.model.get('graphItems'));
        plot.observeInitialPeriod(this.account);
        this.plot = plot;
    },
    onClose: function (e) {
        if (this.plot) {
            this.plot.shutdown();
        }
    }
});
