Lizard.Views.Timeseries = Backbone.Marionette.ItemView.extend({
  initialize: function (options) {
    this.graphCollection = options.graphCollection;
    this.model.on('change', this.render, this);
  },
  tagName: 'li',
  events: {
    'click .info': 'showInfoModal',
    'click .add': 'drawGraph'
  },
  showInfoModal: function() {
    infoModalView = new Lizard.Views.InfoModal({model: this.model});
    window.graphsView.infomodal.show(infoModalView.render());
    $('#info-modal').modal();
  },
  drawGraph: function (e){
    // add to first graph in the graphs view
    var url = $(e.target).data('url');
    this.graphCollection.models[0].get('graphItems').addTimeseriesByUrl(url);
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

Lizard.Views.TimeseriesCollection = Backbone.Marionette.CollectionView.extend({
    initialize: function (options) {
        this.collection = options.collection;
        this.graphCollection = options.graphCollection;
    },
    tagName: 'ul',
    itemView: Lizard.Views.Timeseries,
    itemViewOptions: function (model) {
        return {
            graphCollection: this.graphCollection
        };
    }
});

Lizard.Views.TimeseriesSearch = Backbone.View.extend({
  initialize: function (options) {
    this.timeseriesCollection = options.timeseriesCollection;
  },
  render: function() {
    tpl = '<div class="row-fluid"><input type="text" class="span12 search-query" placeholder="Zoeken" id="searchTimeseries" name="searchTimeseries"></div>';
    this.$el.html(tpl);
    return this;
  },
  events: {'change #searchTimeseries': 'search'},
  search: function(e) {
    this.timeseriesCollection.fetch({data:{'name': $('#searchTimeseries').val()}});
  }
});
