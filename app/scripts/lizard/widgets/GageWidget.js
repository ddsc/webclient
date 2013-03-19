Lizard.Widgets.GageWidget = Marionette.ItemView.extend({
  template: '#gagewidget-template',
  tagName: 'div',
  className: 'gauge-widget',
  onShow: function() {
    $(this.el).attr('id', 'gage_' + this.model.get('widgetId'));
    var that = this;
    var settings = {
      id: 'gage_' + this.model.get('widgetId'),
      value: getRandomInt(this.model.get('min'), this.model.get('max')),
      min: this.model.get('min'),
      max: this.model.get('max'),
      title: this.model.get('title'),
      label: this.model.get('label')
    };

    if (this.model.get('levelColors')) {
      settings['levelColors'] = this.model.get('levelColors');
    }

    if (this.model.get('value')) {
      settings['value'] = this.model.get('value');
    }

    this.justGageRef = new JustGage(settings);

    if (!this.model.get('value')) {
      setInterval(function() { // <-- commented during development...
        that.justGageRef.refresh(getRandomInt(that.model.get('min'),that.model.get('max')));
      }, getRandomInt(that.model.get('refreshRate') * 0.7,that.model.get('refreshRate') * 1.3));
    }
    return this;
  }
});

WIDGET_CLASSES['gage'] = Lizard.Widgets.GageWidget;
