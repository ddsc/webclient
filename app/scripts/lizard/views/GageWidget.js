Lizard.Views.GageWidget = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    // console.log('Lizard.Views.WidgetView initializing');
    that = this;
  },
  tagName: 'li',
  className: 'new',
  template: '#widgetview-template',
  attributes: {
    "data-col": "1", // << this needs to be dynamic!
    "data-row": "1",
    "data-sizex": "2",
    "data-sizey": "2"
  },
  events: {
    'click .icon-cog': 'configureWidget'
  },
  configureWidget: function(e) {
    // alert('test');
    // console.log(this.model.attributes.label + ' of ' + this.model.attributes.title);
    e.preventDefault();
    var template = _.template( $("#widget-configuration").html(), {} );
    this.$el.html( template );
  },
  onShow: function() {
    var that = this;
    var settings = {
      id: this.model.get('gaugeId'),
      value: getRandomInt(this.model.get('min'), this.model.get('max')),
      min: this.model.get('min'),
      max: this.model.get('max'),
      title: this.model.get('title'),
      label: this.model.get('label')
    }

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
      }, getRandomInt(that.model.get('refreshRate') * 0.7,that.model.get('refreshRate') * 1.3))
    }
  }
});
