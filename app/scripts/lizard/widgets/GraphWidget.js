Lizard.ui.Widgets.GraphWidget = Backbone.Marionette.Layout.extend({
  template: '#graph-widget',
  regions: {
    graphRegion: '.graph-region'
  },
  graphModel: null,
  drawGraph: function () {
    this.graphRegion.close();
    var graphView = new Lizard.Views.Graph({
      model: this.graphModel,
      account: account
    });
    this.graphRegion.show(graphView);
    graphView.$el.height(300);
  },
  onShow: function () {
    var dateRange = new Lizard.Models.DateRange({
      accountModel: account // pass the global account instance
    });
    this.graphModel = new Lizard.Models.Graph({
        dateRange: dateRange
    });

    var that = this;
    _.each(this.model.get('timeseries'), function (timeseries_url) {

      var timeseries = new Lizard.Models.TimeseriesActual({url: timeseries_url});
      timeseries.fetch()
      .done(function (model) {
          model.set({pk: model.id});
          var graphItem = new Lizard.Models.GraphItem({timeseries: model});
          that.graphModel.get('graphItems').add(graphItem);
      });
    });
   
    this.drawGraph();
  }
});


WIDGET_CLASSES['graph'] = Lizard.ui.Widgets.GraphWidget;
