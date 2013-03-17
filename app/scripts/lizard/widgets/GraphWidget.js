Lizard.Widgets.GraphWidget = Marionette.ItemView.extend({
  template: '#graph-widget',
  tagName: 'div',
  className: 'graph-widget',
  onShow: function() {
    //$(this.el).attr('id', 'graph_' + this.model.get('widgetId'));

    $(this.el).loadPlotData('http://test.api.dijkdata.nl/api/v0/events/e930cf1f-b927-419e-b093-6d32e39756f8');
    $(this.el).loadPlotData('http://test.api.dijkdata.nl/api/v0/events/579d5258-0e66-47cf-9c81-5936e97e528f');
    $(this.el).loadPlotData('http://test.api.dijkdata.nl/api/v0/events/80cd04fe-0d29-48d2-9f0c-49f2f3b7aba0');

    return this
  }
});

WIDGET_CLASSES['graph'] = Lizard.Widgets.GraphWidget;
