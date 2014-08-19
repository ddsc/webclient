//  popup for ddsc including graph
//
//
//todo: move these classes to lizard.views
// Modal view that opens when clicking on a location


function format_value (value) {
  if (typeof(value) === 'undefined') {
    return '-';
  } else if (typeof(value) === "number") {
    return value.toFixed(2);
  } else if (parseInt(value) !== NaN) {
    return parseInt(value).toFixed(2);
  } else {
    return '-';
  }
}

function format_unit (unit) {
  if (typeof(unit) === "string") {
    return unit;
  } else if (unit.hasOwnProperty('code')) {
    return unit.code;
  }
}

Lizard.Map.LocationModalTimeseries = Backbone.Marionette.Layout.extend({
  template: '#location-modal-timeserie',
  initialize: function(options) {
  },
  events: {
    'click .graph-this': "drawGraph"
  },
  // One Timeserie has many Events. An Events list is only
  // loaded when it is explcitly chosen, with caching.
  drawGraph: function() {
    // Gets the element that is clicked and it's datasets
    var data_url = this.model.attributes.events;
    $('#modal-graph-wrapper').removeClass('hidden');
    $('#modal-graph-wrapper').find('.flot-graph').loadPlotData(data_url + '?eventsformat=flot');
  }
});

Lizard.Views.LocationModalPopupItem = Backbone.Marionette.ItemView.extend({
  initialize: function (options) {
    this.graphModel = options.graphModel;
  },
  template: '#location-modal-popup-item',
  tagName: 'li',
  events: {
    'click .add-graph-item' : "addGraphItem"
  },
  addGraphItem: function () {
    var self = this;
    this.model.fetch()
    .done(function (model) {
        var graphItem = new Lizard.Models.GraphItem({timeseries: model});
        self.graphModel.get('graphItems').add(graphItem);
    });
  }
});

// Modal view that opens when clicking on a location
Lizard.Views.LocationModalPopupList = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Views.LocationModalPopupItem,
  tagName: 'ul',
  initialize: function (options) {
    this.graphModel = options.graphModel;
  },
  itemViewOptions: function (model) {
    return {
      graphModel: this.graphModel
    };
  }
});

// Modal view that opens when clicking on a location
Lizard.Views.LocationModalPopup = Backbone.Marionette.Layout.extend({
    template: '#location-modal-popup',
    primaryTimeseries: null,
    otherTimeseries: null,
    initialize: function (options) {
        this.primaryTimeseries = options.primaryTimeseries;
        this.otherTimeseries = options.otherTimeseries;
    },
    regions: {
        timeseriesRegion: '.modal-timeseries-region',
        graphRegion: '.modal-graph-region'
    },
    onRender: function (e) {
        var self = this;
        this.$el.find('.modal').modal();
        var dateRange = new Lizard.Models.DateRange({
          accountModel: account // pass the global account instance
        });
        var graphModel = new Lizard.Models.Graph({
            dateRange: dateRange
        });
        if (this.primaryTimeseries) {
            // refetch because the inline Serializer seems different from the Detail serializer
            this.primaryTimeseries.fetch()
            .done(function (model) {
                self.primaryTimeseries = model;
                var graphItem = new Lizard.Models.GraphItem({timeseries: model});
                graphModel.get('graphItems').add(graphItem);
            });
        }
        var graphView = new Lizard.Views.GraphAndLegendView({model: graphModel});
        this.graphRegion.show(graphView);

        var timeseriesView = new Lizard.Views.LocationModalPopupList({
            collection: this.otherTimeseries,
            graphModel: graphModel
        });
        this.timeseriesRegion.show(timeseriesView);
        this.$el.find('#location-modal-label').html(self.primaryTimeseries.get('location')['name']);
    }
});


ImageCarouselItemView = Backbone.Marionette.ItemView.extend({
  template: '#image-carousel-itemview',
  className: 'item',
  tagName: 'div',
  onRender: function() {
    var self = this;
    // If this is the first item, add the classname 'active'
    if(self.model.get('first')) {
      self.$el.attr('class', 'active item');

      var img_element = self.$el.find('img').first();

      var src = img_element.data('img-src');
      img_element.attr('src', src);
    }
  }
});
ImageCarouselCollectionView = Backbone.Marionette.CollectionView.extend({
  tagName: 'div',
  className: 'carousel-inner'
});
Lizard.Views.ImageCarouselModal = Backbone.Marionette.Layout.extend({
    template: '#image-carousel-popup',
    regions: {
        graphRegion: '.carousel-graph-region'
    },
    initialize: function (options) {
        this.imageTimeseries = options.imageTimeseries;
    },
    onRender: function (e) {
      var self = this;
      this.$el.find('.modal').modal();

      self.$el.on('slid', function(e) {
        var next = $(e.target).find('div .active');
        var img = next.find('img');
        img.attr('src', img.data('img-src'));
      });

      var url = self.imageTimeseries.get('events');
      var eventsCollection = new Lizard.Collections.Events();
      eventsCollection.url = url + '?page_size=0';
      eventsCollection.fetch().done(function (collection, response) {
        collection.models[0].set({'first': true}); // Set 'first' attribute on first model b/c Bootstrap Carousel needs to know this
        var carouselView = new ImageCarouselCollectionView({
          collection: collection,
          itemView: ImageCarouselItemView,
          emptyView: Lizard.Views.GraphLegendNoItems
        });
        self.graphRegion.show(carouselView);
      });
    }
});

TextTimeserieItemView = Backbone.Marionette.ItemView.extend({
  template: '#timeserie-text-itemview',
  className: 'item',
  tagName: 'div',
  onRender: function() {
    var self = this;
    // If this is the first item, add the classname 'active'
    if(self.model.get('first')) {
      self.$el.attr('class', 'active item');
    }
  }
});
TextTimeserieCollectionView = Backbone.Marionette.CollectionView.extend({
  tagName: 'div',
  className: 'text-timeserie-collection'
});

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
      this.gTiff = options.gTiffTimeseries;
      this.gTiff.bind('change:active_event', this.switchLayer, this);
      this.mapLayer = L.tileLayer.wms('http://maps.ddsc.nl/geoserver/ddsc/wms?service=WMS&version=1.1.0&request=GetMap&',
        {
          service: "WMS",
          type: 'geoTiffTimeseries',
          version: "1.1.0",
          layers: "ddsc:landsat_2015-04-04T115233Z",
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
        self.gTiff.set('active_event', active_event);
        self.fakeRender(active_event);
        // self.populateDatePicker(active_event);
      });
    },
    fakeRender: function (active_event) {
      this.$el.find('#geotiff-datepicker').val(new Date(active_event.get('datetime')).toLocaleString());
    },
    onRender: function () {
      Lizard.mapView.geoTiffRegion.$el.parent().removeClass('hidden');
    },
    switchLayer: function (newModel, oldRef) {
      if (newModel !== oldRef) {
        if (!mc.hasLayer(this.mapLayer)) {
          mc.addLayer(this.mapLayer);
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
      // get next item in eventslist, if there is a 'next item'
      var self = this;
      var active_idx = this.eventsCollection.indexOf(self.gTiff.get('active_event'));
      if (self.eventsCollection.models.length > active_idx + 1) {
        var active_event = self.eventsCollection.models[active_idx + 1];
        self.gTiff.set('active_event', active_event);
        self.fakeRender(active_event);
        self.eventsCollection.each(function (geotiff) {
          geotiff.set('selected', false);
        });
        active_event.set('selected', true);
      }
    },
    previousTiff: function () {
      // get previous item in eventslist, if there is a 'previous item'
      var self = this;
      var active_idx = this.eventsCollection.indexOf(self.gTiff.get('active_event'));
      if (active_idx - 1 >= 0) {
        var active_event = self.eventsCollection.models[active_idx - 1];
        this.gTiff.set('active_event', active_event);
        self.$el.find('#geotiff-datepicker').val(active_event.get('datetime'));
      }
      self.fakeRender(active_event);
    },
    onClose: function () {
      mc.removeLayer(this.mapLayer);
      _.each(mc._layers, function (layer) {
        if (!layer.hasOwnProperty('options')) {return;}
        if (layer.options.hasOwnProperty('type')) {
          if (layer.options.type == 'geoTiffTimeseries' &&
              mc.hasLayer(layer)) {
            mc.removeLayer(layer);
            }
        }
      });
      Lizard.mapView.geoTiffRegion.$el.parent().addClass('hidden');
    }
});


Lizard.Views.TextModal = Backbone.Marionette.Layout.extend({
    template: '#textmodal-popup',
    regions: {
        textRegion: '.text-region'
    },
    initialize: function (options) {
        this.textTimeseriesCollection = options.textTimeseries;
    },
    onRender: function (e) {
      var self = this;
      this.$el.find('.modal').modal();

      var url = self.textTimeseriesCollection.where({'value_type': 'text'})[0].get('events');
      var eventsCollection = new Lizard.Collections.Events();
      eventsCollection.url = url + '?page_size=0';
      eventsCollection.fetch().done(function (collection, response) {
        collection.models[0].set({'first': true}); // Set 'first' attribute on first model b/c Bootstrap needs to know this
        var textTimeserieCollectionView = new TextTimeserieCollectionView({
          collection: collection,
          itemView: TextTimeserieItemView,
          emptyView: Lizard.Views.GraphLegendNoItems
        });
        self.textRegion.show(textTimeserieCollectionView);
      });
    }
});

Lizard.Views.LocationPopupItem = Backbone.Marionette.ItemView.extend({
  template: '#location-popup-item',
  tagName: 'li',
  events: {
    // NOTE: FIX THIS
    'click .popup-toggle' : 'openModal',
    'click .open-geotiff' : 'openGeoTiff',
    'click .image-popup-toggle' : 'openCarouselModal',
    'click .image-popup-text': 'openTextModal',
    'click .icon-comment' : 'openAnnotation',
  },
  initialize: function () {
    Lizard.App.vent.on('changedestroyAnnotation', function () {
      this.countAnnotations('changedestroyAnnotation')
    }, this);
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
  openAnnotation: function(){
    Lizard.App.vent.trigger('makeAnnotation', this.model);
  },
  openModal: function(e) {
    var modalView = new Lizard.Views.LocationModalPopup({
        primaryTimeseries: this.model,
        otherTimeseries: this.model.collection
    });
    Lizard.App.hidden.show(modalView);
    modalView.$el.find('.modal').on('hide', function () {
        Lizard.App.hidden.close();
    });
  },
  openCarouselModal: function(e) {
    var modalView = new Lizard.Views.ImageCarouselModal({
      imageTimeseries: this.model
    });
    Lizard.App.hidden.show(modalView);
    modalView.$el.find('.modal').on('hide', function () {
        Lizard.App.hidden.close();
    });
  },
  openTextModal: function(e) {
    var modalView = new Lizard.Views.TextModal({
      textTimeseries: this.model.collection
    });
    Lizard.App.hidden.show(modalView);
    modalView.$el.find('.modal').on('hide', function () {
        Lizard.App.hidden.close();
    });
  },
  openGeoTiff: function(e) {
    Lizard.Map.geoTiffView = new Lizard.Views.GeoTiffTimeseries({
      gTiffTimeseries: this.model
    });
    Lizard.mapView.geoTiffRegion.show(Lizard.Map.geoTiffView);

    Lizard.Map.geoTiffView.listRegion.show(new Lizard.Views.GeoTiffCollection({
      collection: Lizard.Map.geoTiffView.eventsCollection
    }))
  },
  countAnnotations: function () {
    var self = this;
    this.model.bind('change:annotations', this.render, this);
    var countUrl = settings.annotations_count_url + '?model_names_pks=timeseries,' + this.model.get('id');
    $.get(countUrl).success(function (annotation) {
      self.model.set({annotations: annotation.count});
    });
  }
});

// Modal view that opens when clicking on a location
Lizard.Views.LocationPopup = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Views.LocationPopupItem,
  tagName: 'ul'
});

var mockingjay = {
    "id": 13, 
    "url": "http://localhost:9000/api/v1/timeseries/80cd04fe-0d29-48d2-9f0c-49f2f3b7aba0", 
    "location": {
        "uuid": "7183a79e-6460-42c1-a0eb-8fc8e8f5800c", 
        "name": "Rubidium"
    }, 
    "events": "http://localhost:9000/api/v1/events/80cd04fe-0d29-48d2-9f0c-49f2f3b7aba0", 
    "opendap": "/80cd04fe-0d29-48d2-9f0c-49f2f3b7aba0.ascii", 
    "latest_value": 0.0, 
    "uuid": "64cd04fe-0d29-48d2-9f0c-49f2f3b7aba0", 
    "name": "Landsat (mocked)", 
    "description": "", 
    "value_type": "geotiff", 
    "annotations": 2, 
    "source": {
        "uuid": "58d1e1a1-0a1b-404b-bea2-d0d812a2e6c8", 
        "name": "DDSC Aanpassingen"
    }, 
    "owner": null, 
    "first_value_timestamp": "2013-02-21T16:13:00.000000Z", 
    "latest_value_timestamp": "2013-07-28T11:57:00.000000Z", 
    "parameter": {
        "code": "T", 
        "id": 1785, 
        "description": "Temperatuur"
    }, 
    "unit": {
        "code": "oC", 
        "id": 138, 
        "description": "graad Celsius"
    }, 
    "reference_frame": null, 
    "compartment": null, 
    "measuring_device": null, 
    "measuring_method": null, 
    "processing_method": null, 
    "validate_max_hard": null, 
    "validate_min_hard": null, 
    "validate_max_soft": null, 
    "validate_min_soft": null, 
    "validate_diff_hard": null, 
    "validate_diff_soft": null
};

Lizard.geo.Popups.DdscTimeseries = {
  getPopupContent: function (location, region) {
    var url = settings.timeseries_url + '&location=' + location.get('uuid');
    var tsCollection = new Lizard.Collections.Timeseries();
    tsCollection.url = url;
    tsCollection.fetch().done(function (collection, response) {
        //console.log(collection.models[0].attributes);
        collection.add(new Lizard.Models.Timeserie(mockingjay));
        var popupView = new Lizard.Views.LocationPopup({
            collection: collection
        });
        var popupContent = popupView.render();
        region.show(popupContent);
        Lizard.App.vent.trigger('ResizePopup');
        
    });
  }
};
