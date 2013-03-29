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
      maxClusterRadius: 10
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
    this.addToMap();
  },
  addToMap: function() {
    this.map.mapCanvas.addLayer(this.markers);
  },
  removeFromMap: function() {
    this.map.mapCanvas.removeLayer(this.markers);
  },
  drawOnMap: function(collection, objects){
    var models = collection.models;
    var that = this;
    for (var i in models){
      var model = models[i];
      var attributes = model.attributes;
      var point = model.attributes.point_geometry;
      try {
          var leaflet_point = new L.LatLng(point[1], point[0]);
          var marker = new L.Marker(leaflet_point,{
            icon: L.icon({
              iconUrl: 'scripts/vendor/images/marker-dam-3.png',
              iconAnchor: [16,35],
              popupAnchor: [0, -30]
            }),
            clickable: true,
            name: attributes.name,
            bbModel: model,
            code: attributes.code,
            
          });

        //marker.on('mouseover', this.updateInfo);
        marker.on('click', that.showPopup);
        // marker.on('click ' that.showPopup);
        this.markers.addLayer(marker);
      } catch (e) {
        console.log('Location has no geometry. Error: ' + e);
      }

    }
  },
  showPopup: function(e) {
    var marker = e.target;
    var innerStuff = Lizard.Popups.DdscTimeseries.getPopupContent(marker);
    marker.bindPopup(innerStuff, {maxHeight: 300, minWidth: 400, maxWidth: 450});
    marker.openPopup();
  },
  // largePopupContent: Lizard.Views.TimeserieView,
  // getMouseOverContent: null
});
