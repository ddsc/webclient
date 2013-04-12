Lizard.Views.Timeserie = Backbone.Marionette.ItemView.extend({
  initialize: function() {
    this.model.on('change', this.render, this);
  },
  tagName: 'li',
  events: {
    'click .fav': 'toggleFavorite',
    'click .info': 'showInfoModal',
    'click .add': 'drawGraph'
  },
  toggleFavorite: function(me) {
    var favorite = this.model.get('favorite');
    if(favorite) {
      this.model.set({"favorite": false});
      this.$el.find('i.icon-star').removeClass('icon-star').addClass('icon-star-empty');
    } else {
      this.model.set({"favorite": true});
      this.$el.find('i.icon-star-empty').removeClass('icon-star-empty').addClass('icon-star');
    }
    Lizard.Utils.Favorites.toggleSelected(this.model);
  },
  showInfoModal: function() {
    infoModalView = new Lizard.Views.InfoModal();
    window.graphsView.infomodal.show(infoModalView.render());
    $('#info-modal').modal();
  },
  drawGraph: function (e){
    var data_url = e.target.dataset.url;
    var graph_el = $('.graph-drop').first();
    graph_el.parent().removeClass('empty');
    graph_el.loadPlotData(data_url);
  },
  template: function(model){
      return _.template($('#timeserie-item-template').html(), {
        url: model.url,
        name: model.name,
        uuid: model.uuid,
        events: model.events,
        favorite: model.favorite
      }, {variable: 'timeserie'});
    }
});

Lizard.Views.Timeseries = Backbone.Marionette.CollectionView.extend({
  collection: timeseriesCollection,
  tagName: 'ul',
  itemView: Lizard.Views.Timeserie,
  initialize: function(){
    // this.collection.fetch();
  }
});

Lizard.Views.TimeseriesSearch = Backbone.View.extend({
  render: function() {
    tpl = '<div class="row-fluid"><input type="text" class="span12 search-query" placeholder="Zoeken" id="searchTimeseries" name="searchTimeseries"></div>';
    this.$el.html(tpl);
    return this;
  },
  events: {'keyup #searchTimeseries': 'search'},
  search: function(e) {
    if (Lizard.App.fetchXhr && Lizard.App.fetchXhr.state() == 'pending'){
      // This does not work yet. Work in progress...
      Lizard.App.fetchXhr.reject();
    }
    Lizard.App.fetchXhr = timeseriesCollection.fetch({data:{'name': $('#searchTimeseries').val()}});
  }
});
