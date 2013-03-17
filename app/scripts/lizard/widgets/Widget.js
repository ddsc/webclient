WIDGET_CLASSES = {};

Lizard.Widgets.Widget = Backbone.Marionette.Layout.extend({
  initialize: function(){
    // console.log('Lizard.Views.WidgetView initializing');
    that = this;
  },
  tagName: 'li',
  className: 'new',
  template: '#widgetview-template',
  attributes: function(model ) {
    return {
      "data-col": this.model.get('col'),
      "data-row": this.model.get('row'),
      "data-sizex": this.model.get('size_x'),
      "data-sizey": this.model.get('size_y')
    }
  },
  regions: {
    'content': '.widget'
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
  initialize: function() {
    //initialize class for content
    var widgetClass = WIDGET_CLASSES[this.model.get('type')];
    this.contentView = new widgetClass({model: this.model});
  },
  onShow: function() {
    this.content.show(this.contentView.render());
  }
});

