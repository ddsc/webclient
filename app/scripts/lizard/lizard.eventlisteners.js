// Marionette event listeners
favoritesCollection.on('add', function(model){
  // var attribute = model.id.split(",")[0]
  // var id = model.id.split(",")[1]
  // if (attribute === "location"){
  //   locmodel = locationCollection.get(id);
  //   var point = locmodel.attributes.point_geometry;
  //   window.mapCanvas.setView(new L.LatLng(point[1], point[0]), 16);
  // }
});

favoritesCollection.on('remove', function(model){

});