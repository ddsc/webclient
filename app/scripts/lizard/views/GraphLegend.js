NoItemsView = Backbone.Marionette.ItemView.extend({
  template: "#show-no-items-message-template"
});

GraphLegendItemView = Backbone.Marionette.ItemView.extend({
  template: '#graphs-legend-template'
});

GraphLegendCollectionView = Backbone.Marionette.CollectionView.extend({
  itemView: GraphLegendItemView,
  emptyView: NoItemsView,
  onShow: function(e) {
    var that = this;
    var uuid, graph, timeserie;

    // Drop handling on legend divs!
    this.$el.on('dragover dragenter', false);
    this.$el.on('drop', function(e) {
      e.preventDefault();
      var $target = $(e.target);
      var graphDiv = $(that.$el).parent().parent();
      var graph = new Lizard.Models.Graph();
      var uuid = e.originalEvent.dataTransfer.getData('Text');
 
      var timeserie = timeseriesCollection.get(uuid);
      if(that.collection.find(function(timeserie) {
      })) {
      } else {
        that.collection.add(timeserie);
      }
      // graphDiv.find('.graph-drop').first().loadPlotData(settings.timeseries_url + 'events/' + uuid);
    });


    // Drop handling on main graph divs!
    $('.drop').on('dragover dragenter', false);
    $('.drop').on('drop', function(e) {
      e.preventDefault();

      if($(this).attr('id') === 'drop-one') {
        // console.log('dropping one', $(this));

        graph = new Lizard.Models.Graph();
        uuid = e.originalEvent.dataTransfer.getData('Text');
        timeserie = timeseriesCollection.get(uuid);
        if(that.collection.find(function(timeserie) {
          // console.log('timeserie', timeserie);
        })) {
          // console.log('.....');
        } else {
          window.legendOneCollectionView.collection.add(timeserie);
        }
      }
      if($(this).attr('id') === 'drop-two') {
        // console.log('dropping two');
        graph = new Lizard.Models.Graph();
        uuid = e.originalEvent.dataTransfer.getData('Text');
        timeserie = timeseriesCollection.get(uuid);
        if(that.collection.find(function(timeserie) {
        })) {
        } else {
          window.legendTwoCollectionView.collection.add(timeserie);
        }
      }
    });
  }
});
