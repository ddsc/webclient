Lizard.Views.InfoModal = Backbone.Marionette.ItemView.extend({
  template: '#info-modal-template',
  model: null,
  initialize: function(options) {
    console.log('Lizard.Views.Info initializing');
    this.model = options.model;
  }

});