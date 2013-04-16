Lizard.Models.GraphItem = Backbone.Model.extend({
    defaults: {
        timeseries: null,
        color: '#ccc'
    },
    initialize: function() {
        this.set({
            'color': colorbrewer.Set3[9][Math.floor(Math.random()*8+1)]
        });
    }
});
