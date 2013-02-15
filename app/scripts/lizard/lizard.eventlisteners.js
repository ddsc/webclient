// Marionette event listeners
workspaceCollection.on('add', function(model){
  var attribute = model.id.split(",")[0]
  var id = model.id.split(",")[1]
  timeseriesCollection.url = (settings.timeseries_url + '?' + attribute + '=' + id )
  timeseriesCollection.fetch();
  // if (attribute === "location"){
  //   var point = model.attributes.point_geometry;
  //   console.log(model);
  //   window.mapCanvas.setView(new L.LatLng(point[0], point[1]), 11);
  // }
});

workspaceCollection.on('remove', function(model){

});