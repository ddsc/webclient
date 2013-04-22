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
  // template: function(model){
    // return _.template($('#location-modal-timeserie').html(), {
      // name: model.name,
      // uuid: model.url.split("eries/")[1].split("/")[0],
      // events: model.events,
      // latest_value: model.latest_value,
    // }, {variable: 'timeserie'});
  // },
  template: '#location-modal-timeserie',
  //uuid: null,
  initialize: function(options) {
    //this.uuid = this.model.url.split("eries/")[1].split("/")[0];
  },
  events: {
    'click .graph-this': "drawGraph"
    // 'click .fav': 'toggleFavorite'
  },
  toggleFavorite: function() {
    // var favorite = this.model.get('favorite');
    // if(favorite) {
      // this.model.set({"favorite": false});
      // this.$el.find('i.icon-star').removeClass('icon-star').addClass('icon-star-empty');
    // } else {
      // this.model.set({"favorite": true});
      // this.$el.find('i.icon-star-empty').removeClass('icon-star-empty').addClass('icon-star');
    // }
    //uuid = this.uuid;
    //type = 'timeseries';
    //Lizard.Utils.Favorites.toggleSelected(this.model);
  },
  // One Timeserie has many Events. An Events list is only
  // loaded when it is explcitly chosen, with caching.
  drawGraph: function() {
    // Gets the element that is clicked and it's datasets
    var data_url = this.model.attributes.events;
    $('#modal-graph-wrapper').removeClass('hidden');
    $('#modal-graph-wrapper').find('.flot-graph').loadPlotData(data_url + '?eventsformat=flot');
  },
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
    },
  // itemView: Lizard.Map.LocationModalTimeseries,
  // onRender: function (model){
    // $('#location-modal-label').html(this.location);
    // this.emptyGraph();
  // },
  // emptyGraph: function(){
    // var graph_elements = $('.flot-graph');
//
    // _.each(graph_elements, function(graph_element) {
      // var plot = $(graph_elements).data('plot');
      // if (plot) {
          // plot.removeAllDataUrls();
        // }
    // });
  // }
});

Lizard.Views.LocationPopupItem = Backbone.Marionette.ItemView.extend({
  template: '#location-popup-item',
  tagName: 'li',
  // initialize: function (options) {
    // this.otherTimeseries = options.otherTimeseries;
  // },
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

    // Lizard.mapView.modalitems.show(modalView.render());
    // this.uuid = this.model.attributes.uuid;
    // $('#location-modal').modal();
    // $('#location-modal').on('show', this.showGraph, this);
  },
  // showGraph: function(e){
      // var data_url = $(e.target).data('url');
      // console.log(data_url, $('#modal-graph-wrapper'));
      // $('#modal-graph-wrapper').removeClass('hidden');
      // var flot_div = $('#modal-graph-wrapper').find('.flot-graph');
      // $(flot_div).loadPlotData(data_url + '?eventsformat=flot');
  // },
});

// Modal view that opens when clicking on a location
Lizard.Views.LocationPopup = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Views.LocationPopupItem,
  tagName: 'ul'
});

Lizard.geo.Popups.DdscTimeseries = {
  // modalInfo: function (e){
    // var marker = e.target;
    // var model = marker.valueOf().options.bbModel;
    // $('#modal-graph-wrapper').find('.flot-graph').empty();
    // modalView = new Lizard.Map.ModalTimeseriesView();
    // modalView.locationuuid = model.attributes.uuid;
    // modalView.location = model.attributes.name;
    // timeseriesCollection.reset();
    // timeseriesCollection.fetch({cache: true});
    // Lizard.mapView.modalitems.show(modalView.render());
    // $('#location-modal').modal();
  // },
  getPopupContent: function (location, $elem) {
    var url = settings.timeseries_url + '&location=' + location.uuid;
    var timeseriesCollection = new Lizard.Collections.Timeseries();
    timeseriesCollection.url = url;
    timeseriesCollection.fetch().done(function (collection, response) {
        var popupView = new Lizard.Views.LocationPopup({
            collection: collection
        });

        var popupContent = popupView.render().el;
        $elem.append(popupContent);
    });

    // popupView.locationuuid = model.attributes.uuid;
    // popupView.location = model.attributes.name;
    // timeseriesCollection.reset();
    // timeseriesCollection.fetch();
  },
  // updateInfo: function (e) {
    // var marker = e.target;
    // console.log(e);
    // // props = marker.valueOf().options;
    // // e.layer._map._controlContainer.innerHTML = '<h4>Datapunt</h4>' + (props ?
    // //         '<b>' + props.name + '</b><br>' +
    // //         'Punt: ' + props.code
    // //         : 'Zweef over de punten');
  // },
  // selectforCollage: function(e) {
    // var marker = e.target;
    // var properties = marker.valueOf().options;
    // var wsitem = properties.bbModel;
    // wsitem.set({title: wsitem.attributes.name});
    // Collage.add(wsitem);
  // }
};
