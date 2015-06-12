Lizard.Collections.Graph = Backbone.Collection.extend({
    model: Lizard.Models.Graph,
    saveCollage: function (name, visibility) {
        var self = this;
        // Define two stub models which can be used to save the collage and
        // the individual collage items.
        var Collage = Backbone.Model.extend({
            url: settings.collages_create_url
        });
        var CollageItem = Backbone.Model.extend({
            url: settings.collageitems_create_url
        });
        // Instantiate something to .save().
        var collage = new Collage(
            {
                name: name,
                visibility: visibility
            }
        );
        // Spawn a custom Promise so we can notify the UI that all has been saved.
        var deferred = $.Deferred();
        collage.save()
        .done(function (model, response) {
            // Make a list of all that needs to be saved.
            var allSaves = [];
            // Iterate trough all graphs.
            self.each(function (model, idx, collection) {
                idx++; // index of graphs start at 1.
                var graphItems = model.get('graphItems');
                // Grab all URLs of the underlying timeseries.
                var timeseriesUrls = [];
                graphItems.each(function (graphItem) {
                    timeseriesUrls.push(graphItem.get('timeseries').get('url'));
                });
                if (!timeseriesUrls.length) { return; }
                // Instantiate something to .save().
                var collageItem = new CollageItem(
                    {
                        graph_index: idx,
                        timeseries: timeseriesUrls,
                        collage: collage.get('url')
                    }
                );
                allSaves.push(collageItem.save());
            });
            // Wait for saving multiple items at once.
            // ref: http://stackoverflow.com/questions/6538470/jquery-deferred-waiting-for-multiple-ajax-requests-to-finish
            $.when.apply($, allSaves).done(function () {
                deferred.resolve();
            });
        });
        return deferred;
    }
});
