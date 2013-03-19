Lizard.Widgets.TemplateWidget = Marionette.ItemView.extend({
  getTemplate: function() {
    return this.model.get('template');
  }
});

WIDGET_CLASSES['template'] = Lizard.Widgets.TemplateWidget;
