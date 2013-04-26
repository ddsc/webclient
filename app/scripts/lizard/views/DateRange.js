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
        this.$el.html('start: ' + (this.model.get('start') ? this.model.get('start').toLocaleString() : 'n.v.t.') + ' end: ' + (this.model.get('end') ? this.model.get('end').toLocaleString() : 'n.v.t.'));
    }
});
