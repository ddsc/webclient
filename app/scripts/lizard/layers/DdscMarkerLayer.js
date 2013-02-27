//  Class for locations of DDSC timeseries
//
//
Lizard.Layers.DdscMarkerLayer = Lizard.Layers.MapLayer.extend({
  markers: null,
  collection: null, //locationCollection,
  map: null,
  initialize: function(options) {
    this.collection = options.collection;
    this.map = options.map;

    this.markers = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 200
    });

    // The collection is loaded and the scope "this" is bound to the
    // drawonMap function.
    var that = this;
    this.collection.fetch({
      success: _.bind(that.drawOnMap, that),
      error:function(data, response){
        console.log('Error this'+ response.responseText);
      }
    });
    this.map.mapCanvas.addLayer(this.markers);
  },
  drawOnMap: function(collection, objects){
    var models = collection.models;
    for (var i in models){
      var model = models[i];
      var attributes = model.attributes;
      var point = model.attributes.point_geometry;
      try {
          var leaflet_point = new L.LatLng(point[1], point[0]);
          var marker = new L.Marker(leaflet_point,{
            icon: L.icon({iconUrl: 'scripts/vendor/images/marker-dam-3.png'}),
            clickable: true,
            name: attributes.name,
            bbModel: model,
            code: attributes.code
          });
        //marker.on('mouseover', this.updateInfo);
        //marker.on('click', Lizard.Utils.Map.modalInfo); //todo
        this.markers.addLayer(marker);
      } catch (e) {
        console.log('location has no geometry. error: ' + e)
      }

    }
  }
});
