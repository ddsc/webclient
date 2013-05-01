Lizard.Views.DateRange = Backbone.Marionette.View.extend({
    tagName: 'div',
    model: Lizard.Models.DateRange,
    initialize: function (options) {
    },
    modelEvents: {
        'change': 'render'
    },
    onShow: function (e) {
    },
    onClose: function (e) {
    },
    render: function () {
        this.$el.html('<div class="span9"><div class="pull-left">' + (this.model.get('start') ? this.model.get('start').toLocaleString() : 'n.v.t.') + '</div><div class="pull-right">' + (this.model.get('end') ? this.model.get('end').toLocaleString() : 'n.v.t.') + '</div></div>');
    }
});
