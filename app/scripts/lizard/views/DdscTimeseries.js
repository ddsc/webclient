//  popup for ddsc including graph
//
//
//todo: move these classes to lizard.views
// Modal view that opens when clicking on a location


function format_value(value) {
  if (typeof(value) === 'undefined') {
    return '-';
  } else if (typeof(value) === "number") {
    return value.toFixed(2);
  } else {
    return value;
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
        console.log(collection);
        console.log(response);
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
    'click .popup-toggle' : 'openModal',
    'click .image-popup-toggle' : 'openCarouselModal',
    'click .image-popup-text': 'openTextModal',
    'click .icon-comment' : 'openAnnotation',
    'hover' : 'countAnnotations'
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
  countAnnotations: function () {
    if (this.model.get('annotationCount') === null) {
      var self = this;
      this.model.bind('change:annotationCount', this.render, this);
      var countUrl = settings.annotations_count_url + '?model_names_pks=timeseries,' + this.model.get('id');
      $.get(countUrl).success(function (annotation) {
        self.model.set({annotationCount: annotation.count});
      });
    }
  }
});

// Modal view that opens when clicking on a location
Lizard.Views.LocationPopup = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Views.LocationPopupItem,
  tagName: 'ul'
});

Lizard.geo.Popups.DdscTimeseries = {
  getPopupContent: function (location, region) {
    var url = settings.timeseries_url + '&location=' + location.get('uuid');
    var tsCollection = new Lizard.Collections.Timeseries();
    tsCollection.url = url;
    tsCollection.fetch().done(function (collection, response) {
      // console.log(collection.models[0].attributes);
        var popupView = new Lizard.Views.LocationPopup({
            collection: collection
        });
        var popupContent = popupView.render();
        region.show(popupContent);
        Lizard.App.vent.trigger('ResizePopup');
        
    });
  }
};
