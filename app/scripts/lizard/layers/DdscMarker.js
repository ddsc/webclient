Lizard.Layers.DdscMarker = Lizard.Layers.Layer.extend({
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
  }
});
