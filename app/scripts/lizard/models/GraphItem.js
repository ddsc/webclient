Lizard.Models.GraphItem = Backbone.Model.extend({
    defaults: {
        timeseries: null,
        color: '#ccc' // Grey by default
    },
    initialize: function() {
		
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
