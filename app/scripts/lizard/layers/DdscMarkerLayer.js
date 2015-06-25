//  Class for locations of DDSC timeseries
//
//

Lizard.geo.Layers.DdscMarkerLayer = Lizard.geo.Layers.MapLayer.extend({
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
      reset: true,
      success: _.bind(that.drawOnMap, that),
      error:function(data, response){
        console.log('Error this'+ response.responseText);
      }
    });
    this.addToMap();
  },
  addToMap: function() {
    this.map.mapCanvas.addLayer(this.markers);
    this.set('addedToMap', true);
  },
  removeFromMap: function() {
    this.map.mapCanvas.removeLayer(this.markers);
    this.set('addedToMap', false);
  },
  drawOnMap: function(collection, objects){
    var models = collection.models;
    var that = this;
    for (var i in models){
      var model = models[i];
      var attributes = model.attributes;
      var point = attributes.geometry;
      try {
          var leaflet_point = new L.LatLng(point.coordinates[1], point.coordinates[0]);
          var marker = new L.Marker(leaflet_point, {
            icon: L.icon({
              iconUrl: attributes.icon_url || '/images/marker-icon.png',
              iconAnchor: [16,35],
              popupAnchor: [0, -30]
            }),
            clickable: true,
            name: attributes.name,
            bbModel: model,
            code: attributes.code
          });
        this.markers.addLayer(marker);
        model.set('leaflet_id', marker._leaflet_id);
        marker.on('click', that.showPopup);
      } catch (e) {
        console.log('Location has no geometry. Error: ' + e);
      }

    }
  },
  showPopup: function(e) {
    var marker = e.target;
    if (marker._popup !== undefined) {
      // marker.togglePopup();
      Lizard.App.vent.off('ResizePopup');
      marker.unbindPopup();
    }
    var model = marker.valueOf().options.bbModel;
    var name = marker.valueOf().options.name;
    var popupLayout = new Lizard.geo.Popups.Layout();
    popupLayout.render();
    popupLayout.title.show(new Lizard.geo.Popups.LocationPopupTitle({
      model: model, name: name
    }));
    var innerStuff = Lizard.geo.Popups.DdscTimeseries
      .getPopupContent(model, popupLayout.content);
    var popup = new L.Rrose({
      maxHeight: 300,
      minWidth: 400,
      maxWidth: 450,
      autoPan: false
    });
    popup.setContent(popupLayout.el);
    marker.bindPopup(popup);
    marker.openPopup();
    popup._updatePosition();
    Lizard.App.vent.on('ResizePopup', function () {
      popup._updatePosition.bind(popup);
      popup._map = marker._map;
      popup._updatePosition();
    }, popup);

  }
});

Lizard.geo.Popups.LocationPopupTitle = Backbone.Marionette.ItemView.extend({
  initialize: function (options) {
    this.model = options.model;
    this.model.set({pk: this.model.get('id')});
    Lizard.App.vent.on('changedestroyAnnotation', function () {
      this.countAnnotations();
    }, this);
    this.countAnnotations()
    this.model.set('alarms', false);
    if (Lizard.hasOwnProperty('alarmsCollection')) {
      for (var i = 0; Lizard.alarmsCollection.models.length > i; i++) {
        if (Lizard.alarmsCollection.models[i].get('related_uuid') === this.model.get('uuid')){
          this.model.set('alarms', true);
        }
      }
    }
    if (Lizard.hasOwnProperty('statusCollection')) {
      for (var i = 0; Lizard.statusCollection.models.length > i; i++) {
        if (Lizard.statusCollection.models[i].get('uuid') === this.model.get('uuid')){
          this.model.set('status', true);
        }
      }
    }
  },
  events:{
    'click .icon-comment': 'createAnnotation'
  },
  template: function (model) {
        return _.template(
            $('#timeserie-popup-title-template').html(), {
              title: model.name,
              annotations: model.annotations,
              alarms: model.alarms,
            });
  },
  createAnnotation: function(){
    Lizard.Views.CreateAnnotationView(this.model);
  },
  countAnnotations: function () {
    var self = this;
    this.model.bind('change:annotations', this.render, this);
    var pk = this.model.get('id');
    var countUrl = settings.annotations_url
      + '?object_type__model=location&object_id='
      + pk;
    $.get(countUrl).success(function (response) {
      self.model.set({annotations: response.count});
    });
  },
  onClose: function () {
    Lizard.App.vent.off('changedestroyAnnotation')
  }
});

Lizard.geo.Popups.Layout = Backbone.Marionette.Layout.extend({
    template: '#timeseries-popup-template',
    regions:{
      'content' :'#ts-popup-content',
      'title' : '#ts-popup-title'
    }
});
