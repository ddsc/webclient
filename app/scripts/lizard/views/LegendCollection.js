function FilteredCollection(original){
    var filtered = new original.constructor();
    
    // allow this object to have it's own events
    filtered._callbacks = {};

    // call 'where' on the original function so that
    // filtering will happen from the complete collection
    filtered.where = function(criteria){
        var items;
        
        // call 'where' if we have criteria
        // or just get all the models if we don't
        if (criteria){
            items = original.where(criteria);
        } else {
            items = original.models;
        }
        
        // store current criteria
        filtered._currentCriteria = criteria;
        
        // reset the filtered collection with the new items
        filtered.reset(items);
    };
        
    
    // when the original collection is reset,
    // the filtered collection will re-filter itself
    // and end up with the new filtered result set
    original.on("reset add remove change", function(){
        filtered.where(filtered._currentCriteria);
    });
        
    return filtered;
}

Lizard.Views.LegendItemView = Backbone.Marionette.ItemView.extend({
	template: '#map-legend-template',
	initialize: function() {
		console.log('initializing Lizard.Views.LegendItemView');
	}
});

Lizard.Views.LegendCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: Lizard.Views.LegendItemView,
    workspace: null,
	initialize: function(options) {
		console.log('initializing Lizard.Views.LegendCollectionView');
		this.workspace = options.workspace;
		this.collection = FilteredCollection(this.workspace);
		this.collection.where({visibility: true});
		//this.listenTo(this.workspace, 'change:visibility', this.updateLegend, this);
	},
	updateLegend: function() {
		console.log('updateLegend()');
	}
});
