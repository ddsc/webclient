//  popup for ddsc including graph
//
//
//todo: move these classes to lizard.views
// Modal view that opens when clicking on a location

Lizard.Map.TimeserieView = Backbone.Marionette.ItemView.extend({
  template:function(model){
    return _.template($('#location-popup-timeserie').html(), {
      name: model.name,
      uuid: model.url.split("eries/")[1].split("/")[0],
      events: model.events,
    }, {variable: 'timeserie'});
  },
  uuid: null,
  tagName: 'li',
  events: {
    'click' : "openModal"
  },
  openModal: function() {
    var model = this.model;
    $('#modal-graph-wrapper').find('.flot-graph').empty();
    modalView = new Lizard.Map.ModalTimeseriesView();
    modalView.locationuuid = model.attributes.uuid;
    modalView.location = model.attributes.name;
    Lizard.mapView.modalitems.show(modalView.render());
    this.uuid = this.model.url.split("eries/")[1].split("/")[0];
    $('#location-modal').modal();
    console.log($('#location-modal').find('#' + this.uuid));
    $('#location-modal').find('#' + this.uuid).collapse();
  }
});

// Modal view that opens when clicking on a location
Lizard.Map.TimeseriesView = Backbone.Marionette.CollectionView.extend({
  collection: timeseriesCollection,
  itemView: Lizard.Map.TimeserieView,
  tagName: 'ul',
  onBeforeRender: function(){
    this.collection.url = settings.timeseries_url +
      '&location=' + this.locationuuid;
  }
});

Lizard.Map.ModalTimeserie = Lizard.Map.TimeserieView.extend({
  template: function(model){
    return _.template($('#location-modal-timeserie').html(), {
      name: model.name,
      uuid: model.url.split("eries/")[1].split("/")[0],
      events: model.events,
    }, {variable: 'timeserie'});
  },
  events: {
    'click .graph-this': "drawGraph",
    'click .fav': 'toggleFavorite',
  },
  toggleFavorite: function() {
    var favorite = this.model.get('favorite');
    if(favorite) {
      this.model.set({"favorite": false});
      this.$el.find('i.icon-star').removeClass('icon-star').addClass('icon-star-empty');
    } else {
      this.model.set({"favorite": true});
      this.$el.find('i.icon-star-empty').removeClass('icon-star-empty').addClass('icon-star');
    }
    uuid = this.uuid;
    type = 'timeseries';
    Lizard.Utils.Favorites.toggleSelected(this.model);
  },
  // One Timeserie has many Events. An Events list is only
  // loaded when it is explcitly chosen, with caching.
  drawGraph: function(clickedon){
    // Gets the element that is clicked and it's datasets
    var data_url = clickedon.target.dataset.url;
    $('#modal-graph-wrapper').removeClass('hidden');
    $('#modal-graph-wrapper').find('.flot-graph').loadPlotData(data_url + '?eventsformat=flot');
  }
});

// Modal view that opens when clicking on a location
Lizard.Map.ModalTimeseriesView = Lizard.Map.TimeseriesView.extend({
  itemView: Lizard.Map.ModalTimeserie,
  onRender: function (model){
    $('#location-modal-label').html(this.location);
  }
});


Lizard.Popups.DdscTimeseries = {
  modalInfo: function (e){
    var marker = e.target;
    var model = marker.valueOf().options.bbModel;
    $('#modal-graph-wrapper').find('.flot-graph').empty();
    modalView = new Lizard.Map.ModalTimeseriesView();
    modalView.locationuuid = model.attributes.uuid;
    modalView.location = model.attributes.name;
    timeseriesCollection.reset();
    timeseriesCollection.fetch({cache: true});
    Lizard.mapView.modalitems.show(modalView.render());
    $('#location-modal').modal();
  },
  getPopupContent: function (marker){
    var model = marker.valueOf().options.bbModel;
    popupView = new Lizard.Map.TimeseriesView();
    popupView.locationuuid = model.attributes.uuid;
    popupView.location = model.attributes.name;
    timeseriesCollection.reset();
    timeseriesCollection.fetch();
    popupContent = popupView.render().el;
    return popupContent;
  },
  updateInfo: function (e) {
    var marker = e.target;
    console.log(e);
    // props = marker.valueOf().options;
    // e.layer._map._controlContainer.innerHTML = '<h4>Datapunt</h4>' + (props ?
    //         '<b>' + props.name + '</b><br>' +
    //         'Punt: ' + props.code
    //         : 'Zweef over de punten');
  },
  selectforCollage: function(e) {
    var marker = e.target;
    var properties = marker.valueOf().options;
    var wsitem = properties.bbModel;
    wsitem.set({title: wsitem.attributes.name});
    Collage.add(wsitem);
  }
};