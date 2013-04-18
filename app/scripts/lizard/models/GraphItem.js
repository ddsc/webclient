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
    initialize: function (options) {
        //var colors = ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"];
        // Get a random color set from Colorbrewer.js
        var colorSet = colorbrewer[Object.keys(colorbrewer)[Math.floor(Object.keys(colorbrewer).length * Math.random())]];

        // Get a random array from colorSet
        var colorArray = colorSet[Object.keys(colorSet)[Math.floor(Object.keys(colorSet).length * Math.random())]];

        // Get a random color from colorArray
        var color = colorArray[(Math.floor(Math.random()*colorArray.length-1)+1)];

        this.set({
            'color': color
        });
    }
});
