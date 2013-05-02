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
    var graphItem = new Lizard.Models.GraphItem({timeseries: this.model});
    this.graphModel.get('graphItems').add(graphItem);
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
        this.$el.find('.modal').modal();
        var graphModel = new Lizard.Models.Graph();
        if (this.primaryTimeseries) {
            var graphItem = new Lizard.Models.GraphItem({timeseries: this.primaryTimeseries});
            graphModel.get('graphItems').add(graphItem);
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

Lizard.Views.LocationPopupItem = Backbone.Marionette.ItemView.extend({
  template: '#location-popup-item',
  tagName: 'li',
  events: {
    'click .popup-toggle' : "openModal",
    'click .icon-comment' : 'openAnnotation'
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
  }
});

// Modal view that opens when clicking on a location
Lizard.Views.LocationPopup = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Views.LocationPopupItem,
  tagName: 'ul'
});

Lizard.geo.Popups.DdscTimeseries = {
  getPopupContent: function (location, $elem) {
    var url = settings.timeseries_url + '&location=' + location.get('uuid');
    var tsCollection = new Lizard.Collections.Timeseries();
    tsCollection.url = url;
    tsCollection.fetch().done(function (collection, response) {
        var popupView = new Lizard.Views.LocationPopup({
            collection: collection
        });

        var popupContent = popupView.render().el;
        $elem.append(popupContent);
    });
  }
};
