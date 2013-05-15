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
        this.$el.html('<div class="span9 hidden-tablet"><div class="badge pull-left">' + 
            (this.model.get('start') ? this.model.get('start').toLocaleString() : 'n.v.t.') + 
            '</div><div class="badge pull-right">' +
            (this.model.get('end') ? this.model.get('end').toLocaleString() : 'n.v.t.') + 
            '</div></div>' +
            '<div class="span12 visible-tablet"><div class="badge pull-left">' + 
            (this.model.get('start') ? this.model.get('start').toLocaleString() : 'n.v.t.') + 
            '</div><div class="badge pull-right">' +
            (this.model.get('end') ? this.model.get('end').toLocaleString() : 'n.v.t.') + 
            '</div></div>');
    }
});
