Lizard.Models.WorkspaceItem = Backbone.AssociatedModel.extend({
  initialize: function(obj) {
    this.set('display_name', obj.wms_source.display_name);
    this.set('opacity', obj.wms_source.options.opacity*100);
    this.set('type', obj.wms_source.type);
    try {
      if (obj.wms_source.options.type) {
        this.set('type', obj.wms_source.options.type);
      }
    } catch(e) {

    }
    var layerClass = LAYER_CLASSES[this.get('type')];

    this.set('layer', new layerClass(obj.wms_source));
    this.get('layer').set('order', this.get('order'));
    this.on('change:opacity', function(model) {
      console.log('Change opacity of ', model);
    });
    this.on('change:order', function(model){
      model.get('layer').set('order',model.get('order'));
    });
  },
  defaults: {
    order: 0,
    opacity: 100,
    visibility: true,
    selected: false
  }
});