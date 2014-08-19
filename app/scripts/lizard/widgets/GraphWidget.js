Lizard.ui.Widgets.GraphWidget = Backbone.Marionette.Layout.extend({
  template: '#graph-widget',
  regions: {
    graphRegion: '.graph-region'
  },
  drawGraph: function () {
    this.graphRegion.close();
    var graphView = new Lizard.Views.Graph({
      model: Lizard.Dashboard.graphModel,
      account: account
    });
    this.graphRegion.show(graphView);
    graphView.$el.height(300);
  },
  onShow: function () {
    if (!account.get('authenticated')) {
      return;
    }
    var dateRange = new Lizard.Models.DateRange({
      accountModel: account // pass the global account instance
    });
    // in the case of DMC we don't want an empty 
    // set to return AAAALLLLL of the things
    if (!dateRange.get('start')) {
      var max = moment();
      dateRange.set('end', max.toDate());
      min = moment(max).subtract('weeks', 1);
      dateRange.set('start', min.toDate());
    }
    Lizard.Dashboard.graphModel = new Lizard.Models.Graph({
        dateRange: dateRange
    });

    var that = this;
    _.each(this.model.get('timeseries'), function (timeseries_url) {

      var timeseries = new Lizard.Models.TimeseriesActual({url: timeseries_url});
      timeseries.fetch()
      .done(function (model) {
          model.set({pk: model.id});
          var graphItem = new Lizard.Models.GraphItem({timeseries: model});
          Lizard.Dashboard.graphModel.get('graphItems').add(graphItem);
          Lizard.App.vent.trigger('drawWidgetLegend');

      });
    });
    this.drawGraph();
  }
});


WIDGET_CLASSES['graph'] = Lizard.ui.Widgets.GraphWidget;

Lizard.ui.Widgets.LegendWidget = Backbone.Marionette.Layout.extend({
  template: '#legend-widget',
  regions: {
    legendRegion: '.legend-region'
  },
  initialize: function () {
    Lizard.App.vent.on('drawWidgetLegend', this.drawLegend, this);
  },
  drawLegend: function () {
    if (this.legendRegion) {
      this.legendRegion.close();
    }
    var collection = Lizard.Dashboard.graphModel.get('graphItems');
    collection.draggable = false;
    var legendView = new Lizard.Views.GraphLegendCollection({
      collection: collection
    });
    this.legendRegion.show(legendView);
    legendView.$el.height(300);
  },
  onShow: function () {
    Lizard.App.vent.on('drawWidgetLegend', this.drawLegend, this);
  },
  onClose: function () {
    Lizard.App.vent.off('drawWidgetLegend');
  }
});

WIDGET_CLASSES['legend'] = Lizard.ui.Widgets.LegendWidget;
