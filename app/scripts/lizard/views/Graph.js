Lizard.Views.Graph = Backbone.Marionette.View.extend({
    tagName: 'div',
    className: 'graph',
    model: Lizard.Models.Graph,
    initialize: function (options) {
        this.account = options.account;

        // listenTo automatically deregisters event handler
        this.listenTo(this.model.get('graphItems'), 'add remove reset', this.showHideTemplate, this);
    },
    showHideTemplate: function(e) {
        if (this.model.get('graphItems').length === 0) {
            this.$el.find('.overlayer').show();
        } else {
            this.$el.find('.overlayer').hide();
        }
    },
    onShow: function (e) {
        var plot = this.$el.initializePlot();
        plot.observeGraphModel(this.model);
        this.plot = plot;
        this.$el.append('<div class="overlayer hidden-tablet hidden-phone"><img src="images/drag_animation.gif"/></div>');
        this.showHideTemplate();
    },
    onClose: function (e) {
        if (this.plot) {
            this.plot.shutdown();
        }
    }
});
