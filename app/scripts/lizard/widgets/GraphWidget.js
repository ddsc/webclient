Lizard.Widgets.GraphWidget = Marionette.ItemView.extend({
  template: '#graph-widget',
  tagName: 'div',
  className: 'graph-widget',
  onShow: function() {
    //$(this.el).attr('id', 'graph_' + this.model.get('widgetId'));
    var that = this;

    _.each(this.model.get('timeseries'), function (timeseries_url) {
      $(that.el).loadPlotData(timeseries_url);
    });

    return this;
  }
});

WIDGET_CLASSES['graph'] = Lizard.Widgets.GraphWidget;
