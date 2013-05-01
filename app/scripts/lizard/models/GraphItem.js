var lineColors = ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed", "#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"];

Lizard.Models.GraphItem = Backbone.Model.extend({
    defaults: {
        timeseries: null,
        color: '#ccc' // Grey by default
    },
    hash: function (str, maxExcl) {
        /* unused for now */
        var hash = 0;
        var m = Math.pow(2, 31);
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = char + (hash << 6) + (hash << 16) - hash;
        }
        hash = (hash & hash) + m;
        return Math.round(hash * (maxExcl - 1) / Math.pow(2, 32));
    },
    determineColor: function () {
        this.set({
            'color': lineColors[this.collection.indexOf(this)]
        });
    },
    initialize: function (options) {
        this.listenTo(this, 'add', this.determineColor, this);
    }
});
