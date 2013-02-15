Lizard.Visualsearch = {
  init: function() {
    var visualSearch = VS.init({
      container : $('.visual_search'),
      placeholder: 'Zoeken naar...',
      query     : '',
      callbacks : {
        search : function(query, searchCollection) {
          // Search now goes through the parameters, filters and locations requested
          // to give back models that are already in the namespace collections
          //
          var results =[]
          var url = settings.timeseries_url + '?'
          _.each(searchCollection.models, function(search){
            if (search.attributes.category === "parameter"){
              _.each(parameterCollection.where({description : search.attributes.value}), function(model){
                workspaceItem = new Lizard.Models.WorkspaceItem({id: "parameter," + model.id});
                results.push(workspaceItem);
                url = url + '&parameter=' + model.id;
              })
            } 
            else if (search.attributes.category === "location") {
              _.each(locationCollection.where({name : search.attributes.value}), function(model){
                workspaceItem = new Lizard.Models.WorkspaceItem({id: "location,"+ model.attributes.uuid});
                results.push(workspaceItem);
                url = url + '&location=' + model.attributes.uuid;
              })
            } else if (search.attributes.category === "filter") {
              _.each(filterCollection.where({name : search.attributes.value}), function(model){
                workspaceItem = new Lizard.Models.WorkspaceItem({id: "logicalgroups,"+ model.id});
                results.push(workspaceItem);
                url = url + '&logicalgroups=' + model.id;
              })
            }
            timeseriesCollection.url = url;
            timeseriesCollection.fetch();
            workspaceCollection.add(results);
          });
        },
         facetMatches : function(callback) {
           callback([
               'filter', 'location', 'parameter'
           ]);
        },
        valueMatches : function(facet, searchTerm, callback) {
          // We are now using the existing collections to update the search bar
          switch (facet) {
            case 'filter':
                var lg = [];
                var logicalgroups = filterCollection.models;
                _.each(logicalgroups, function(logicalgroups) { lg.push(logicalgroups.attributes.name); });
                callback(lg);
              break;
            case 'location':
                var lc = [];
                var locations = locationCollection.models;
                _.each(locations, function(locations) { lc.push(locations.attributes.name); });
                callback(lc);
              break;
            case 'parameter':
                var pm = [];
                var parameters = parameterCollection.models;
                _.each(parameters, function(parameters) {
                  pm.push({value: parameters.attributes.description}); 
                });
                callback(pm);
              break;
        }
      }
    }
  })
}
};