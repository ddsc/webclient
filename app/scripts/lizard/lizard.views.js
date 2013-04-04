/**
 ItemViews
*/

Lizard.Views = {};


// This is a generic ItemView which can be reused
Lizard.Views.ItemView = Backbone.Marionette.ItemView.extend({
  _modelBinder: undefined,
  initialize: function(){
    this._modelBinder = new Backbone.ModelBinder();
    this.model.on('reset', this.render, this);
  },
  onRender: function() {
    var bindings = {state: 'span.state'};
    this._modelBinder.bind(this.model, this.el, bindings);
  },
  tagName: 'li'
});