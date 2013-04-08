NoItemsView = Backbone.Marionette.ItemView.extend({
  template: "#show-no-items-message-template"
});

GraphLegendItemView = Backbone.Marionette.ItemView.extend({
  template: '#graphs-legend-template'
});

GraphLegendCollectionView = Backbone.Marionette.CollectionView.extend({
  itemView: GraphLegendItemView,
  emptyView: NoItemsView,
  initialize: function() {
    console.log('initialize()');
    // console.log($(this.el).parent('.row-fluid'));
    // var g = this.$el.parent('graph').initFlotGraph();
    // _.bind(this.collection);
  },
  onShow: function(e) {
    var that = this;
    this.$el.on('dragover dragenter', false);
    this.$el.on('drop', function(e) {
      e.preventDefault();
      console.log('e', e.originalEvent.target);
      var $target = $(e.target);
      var graph = new Lizard.Models.Graph();
      var uuid = e.originalEvent.dataTransfer.getData('Text');
      var timeserie = timeseriesCollection.get(uuid);
      that.collection.add(timeserie);


      $target.parent().removeClass("empty");
      // only fire for nearest .graph-drop parent (in case there is already a graph in the element)
      var $graph = $target;
      if (!$graph.hasClass('graph-drop')) {
          $graph = $target.parent('.graph-drop');
      }
      $graph.loadPlotData(settings.timeseries_url + 'events/' + uuid);

      // var $graph = $('#drop-one .graph-drop');
      // $graph.loadPlotData(settings.timeseries_url + 'events/' + uuid);
    });
  }
});
