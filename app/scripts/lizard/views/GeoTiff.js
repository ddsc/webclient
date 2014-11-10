// All geotiff stuff happens here


Lizard.Views.GeoTiff = Marionette.ItemView.extend({
  initialize: function () {
    this.model.set('selected', false);
    this.model.on('change:selected', this.render, this);
  },
  template: '#geotiff-item-template',
  tagName: 'li',
  className: 'drawer-item',
  // initialize: function () {
  //   this.model.bind('change', this.render);
  // },
  events: {
    'click .layer-item': 'select'
  },
  //create a radio button (one workspace selected at a time)
  select: function(e) {
    this.model.collection.each(function (geotiff) {
      geotiff.set('selected', false);
    });
    this.model.set('selected', true);
    Lizard.Map.geoTiffView.gTiff.set('active_event', this.model);
  }
});

Lizard.Views.GeoTiffCollection = Backbone.Marionette.CollectionView.extend({
  tagName: 'ul',
  className: 'wms_sources drawer-group',
  itemView: Lizard.Views.GeoTiff,
  onShow: function () {
    this.$el.parent().on('scroll.geotiff', this.checkScroll.bind(this));
  },
  onClose: function () {
    this.$el.parent().off('scroll.geotiff');
  },
  checkScroll: function () {
    var self = this;
    var triggerPoint = 100;
    if (!this.collection.isLoading && this.el.parentNode.scrollTop + this.el.parentNode.clientHeight + triggerPoint > this.el.scrollHeight) {
      this.collection.isLoading = true;
      this.collection.url = this.collection.next;
      this.collection.fetch({remove: false})
      .always(function () {self.collection.isLoading = false;});
    }

  }
});

/**
 * TODO: make datetime field editable. At the moment, only the arrows can be used.
 */
Lizard.Views.GeoTiffTimeseries = Backbone.Marionette.Layout.extend({
    template: '#geotiff-template',
    regions: {
        // widgetRegion: '.widget-region',
        listRegion: '.list-region'
    },
    events: {
      'click .next': 'nextTiff',
      'click .previous': 'previousTiff'
    },
    initialize: function (options) {
      this.map = options.map || mc;
      this.gTiff = options.gTiffTimeseries;
      this.gTiff.bind('change:active_event', this.switchLayer, this);
      this.mapLayer = L.tileLayer.wms('http://maps.ddsc.nl/geoserver/ddsc/wms?service=WMS&version=1.1.0&request=GetMap&',
        {
          service: "WMS",
          type: 'geoTiffTimeseries',
          version: "1.1.0",
          srs: "EPSG:3857",
          format: "image/png",
          transparent: true
        });

      this.eventsCollection = new Lizard.Collections.Events();
      var self = this;
      this.eventsCollection.parse = function (response) { 
        self.eventsCollection.next = response.next;
        return response.results; 
      };
      this.eventsCollection.url = this.gTiff.get('events') + '?page_size=10';
      this.eventsCollection.fetch().done(function (collection, response) {
        var active_event = collection.models.slice(-1)[0]; // most recent
        active_event.set('selected', true);
        self.mapLayer.setParams({
          layers: active_event.get('layer')
        });
        self.gTiff.set('active_event', active_event);
        self.fakeRender(active_event);
        // self.populateDatePicker(active_event);
      });
    },
    fakeRender: function (active_event) {
      this.$el.find('#geotiff-datepicker').val(new Date(active_event.get('datetime'))
        .toLocaleString('nl'));
    },
    onRender: function () {
      Lizard.mapView.geoTiffRegion.$el.parent().removeClass('hidden');
    },
    switchLayer: function (newModel, oldRef) {
      if (newModel !== oldRef) {
        if (!this.map.hasLayer(this.mapLayer)) {
          this.map.addLayer(this.mapLayer);
          this.mapLayer.bringToFront();
        }
        var active_event = this.gTiff.get('active_event');
        this.mapLayer.setParams({
          layers: active_event.get('layer')
        });
      }
      this.fakeRender(active_event);
    },
    nextTiff: function () {
      // get next item in eventslist
      var self = this;
      var active_idx = this.eventsCollection.indexOf(self.gTiff.get('active_event'));
      var length = self.eventsCollection.models.length;
      var next_idx = (active_idx + 1) % length;
      var active_event = self.eventsCollection.models[next_idx];
      self.gTiff.set('active_event', active_event);
      self.fakeRender(active_event);
      self.eventsCollection.each(function (geotiff) {
        geotiff.set('selected', false);
      });
      active_event.set('selected', true);
    },
    previousTiff: function () {
      // get previous item in eventslist
      var self = this;
      var active_idx = this.eventsCollection.indexOf(self.gTiff.get('active_event'));
      var length = self.eventsCollection.models.length;
      var previous_idx = (length + active_idx - 1) % length;
      var active_event = self.eventsCollection.models[previous_idx];
      self.$el.find('#geotiff-datepicker').val(active_event.get('datetime'));
      self.eventsCollection.each(function (geotiff) {
        geotiff.set('selected', false);
      });
      active_event.set('selected', true);
      this.gTiff.set('active_event', active_event);
      self.fakeRender(active_event);
    },
    onClose: function () {
      this.map.removeLayer(this.mapLayer);
      _.each(this.map._layers, function (layer) {
        if (!layer.hasOwnProperty('options')) {return;}
        if (layer.options.hasOwnProperty('type')) {
          if (layer.options.type == 'geoTiffTimeseries' &&
              this.map.hasLayer(layer)) {
            this.map.removeLayer(layer);
            }
        }
      });
      Lizard.mapView.geoTiffRegion.$el.parent().addClass('hidden');
    }
});



