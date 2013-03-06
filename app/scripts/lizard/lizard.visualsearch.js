Lizard.Visualsearch = {
  init: function () {
    Lizard.Visualsearch.VS = VS.init({
      container : $('.visual_search'),
      placeholder: 'Zoeken naar...',
      query     : '',
      callbacks : {
        search : function(query, searchCollection) {
          // Search now goes through the parameters, filters and locations requested
          // to give back models that are already in the namespace collections
          var results =[];
          var url = settings.timeseries_url + '?';
          _.each(searchCollection.models, function (search) {
            if (search.attributes.category === "parameter") {
              _.each(parameterCollection.where({description : search.attributes.value}), function (model) {
                var extra = '&parameter=' + model.id;
                locationCollection.url = settings.locations_url + '?' + extra;
                filterCollection.url = settings.filters_url + '?' + extra;
                locationCollection.fetch();
                filterCollection.fetch();
                console.log(url);
                url = url + extra;
              });
            }
            else if (search.attributes.category === "location") {
              _.each(locationCollection.where({name : search.attributes.value}), function (model) {
                url = url + '&location=' + model.attributes.uuid;
                var extra = '&location=' + model.attributes.uuid;
                parameterCollection.url = settings.parameters_url + '?' + extra;
                filterCollection.url = settings.filters_url + '?' + extra;
                parameterCollection.fetch();
                filterCollection.fetch();
                var point = model.attributes.point_geometry;
                if (window.mapCanvas){
                  window.mapCanvas.setView(new L.LatLng(point[1], point[0]), 16);
                }
              });
            } else if (search.attributes.category === "filter") {
              _.each(filterCollection.where({name : search.attributes.value}), function (model) {
                url = url + '&logicalgroups=' + model.id;
                var extra = '&logicalgroups=' + model.id;
                parameterCollection.url = settings.parameters_url + '?' + extra;
                locationCollection.url = settings.locations_url + '?' + extra;
                parameterCollection.fetch();
                locationCollection.fetch();
              });
            } else {
              search_results_view = $("#homepage-searchresult-template").html();
              var search_results = timeseries_idx.search(search.attributes.value);
              var render_results = [];
              _.each(search_results, function(sr) { render_results.push(timeseriesCollection.get(sr.ref)); });
              $('#homepage-search-results').html("");
              $('#homepage-search-results').append(_.template(search_results_view, { data:render_results, term: search.attributes.value }));
            }
          });
        },
        facetMatches : function(callback) {
           callback([
               'filter', 'location', 'parameter'
           ]);
        },
        valueMatches : function (facet, searchTerm, callback) {
          // We are now using the existing collections to update the search bar
          switch (facet) {
            case 'filter':
                var lg = [];
                var logicalgroups = filterCollection.models;
                _.each(logicalgroups, function (logicalgroups) { lg.push(logicalgroups.attributes.name); });
                callback(lg);
              break;
            case 'location':
                var lc = [];
                var locations = locationCollection.models;
                _.each(locations, function (locations) { lc.push(locations.attributes.name); });
                callback(lc);
              break;
            case 'parameter':
                var pm = [];
                var parameters = parameterCollection.models;
                _.each(parameters, function (parameters) { pm.push({value: parameters.attributes.description}); });
                callback(pm);
              break;
        }
      },
      clearSearch: function () {
        Lizard.Visualsearch.VS.searchBox.setQuery("");
      }
    }
  });
}
};