Lizard.Views.Layer = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: '#layeritem-template',
  initialize: function() {
    this.model.bind('change', this.render);
  },
  events: {
    'click .icon-circle-arrow-up': 'moveUp',
    'click .icon-circle-arrow-down': 'moveDown',
    'click .indicator': 'toggleVisibility'
  },
  moveUp: function(event) {
    console.log('moveUp!', this.model.get('display_name'));
  },
  moveDown: function(event) {
    console.log('moveDown!', this.model.get('display_name'));
  },
  toggleVisibility: function(event) {
    console.log('Toggle!', this.model.get('display_name'));
  },
  onBeforeRender: function(model) {
    // console.log('onBeforeRender', model);
  }
});