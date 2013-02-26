//  Class for locations of DDSC timeseries
//
//
Lizard.Layers.DdscMarkerLayer = Lizard.Layers.MapLayer.extend({
  markers: null,
  collection: locationCollection,
  map: null,
  onShow: function() {
      this.markers = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 200
    });

    // The collection is loaded and the scope "this" is bound to the
    // drawonMap function.
    var that = this;
    this.collection.fetch({
      success: _.bind(Lizard.Utils.Map.drawonMap, that),
      error:function(data, response){
        console.log('Error this'+ response.responseText);
      }
    });
    this.map.mapCanvas.addLayer(this.markers);
  },
  drawonMap: function(collection, objects){
    var models = collection.models;
    for (var i in models){
      var model = models[i];
      var attributes = model.attributes;
      // var x = 4.411944150924683 + (Math.random() / 500.0);
      // var y = 52.22242675741608 + (Math.random() / 500.0);
      // var point = [x,y];
      var point = model.attributes.point_geometry;
      var leaflet_point = new L.LatLng(point[1], point[0]);
      var marker = new L.Marker(leaflet_point,{
        icon: L.icon({iconUrl: 'scripts/vendor/images/marker-dam-3.png'}),
        clickable: true,
        name: attributes.name,
        bbModel: model,
        code: attributes.code
      });
      //marker.on('mouseover', this.updateInfo);
      marker.on('click', Lizard.Utils.Map.modalInfo);
      this.markers.addLayer(marker);
    }
  }
});
