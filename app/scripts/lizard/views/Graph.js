Lizard.Views.Graph = Backbone.Marionette.View.extend({
    tagName: 'div',
    className: 'graph',
    model: Lizard.Models.Graph,
    initialize: function (options) {
        this.account = options.account;

    },
    showHideTemplate: function(e) {
        console.log('changed:', this.$el);
        if (this.model.get('graphItems').length === 0) {
            this.$el.find('.overlayer').show();
        } else {
            this.$el.find('.overlayer').hide();
        }
    },
    onShow: function (e) {
        var plot = this.$el.initializePlot();
        plot.observeCollection(this.model.get('graphItems'));
        plot.observeInitialPeriod(this.account);
        this.plot = plot;
        this.$el.append('<div class="overlayer hidden-tablet hidden-phone"><img src="images/drag_animation.gif"/></div>');
        this.model.get('graphItems').on('add remove reset', this.showHideTemplate, this);
    },
    onClose: function (e) {
        if (this.plot) {
            this.plot.shutdown();
        }
        this.model.get('graphItems').off('add remove reset', this.showHideTemplate, this);
    }
});
