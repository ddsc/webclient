Lizard.Layers.WMSItem = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  className: 'drawer-item',
  initialize: function () {
    this.model.bind('change', this.render);
  },
  onBeforeRender: function () {
    this.el.setAttribute("id", this.model.attributes.display_name);
  },
  events: {
    'click .layer-item .indicator': 'toggleVisibility'
  },
  toggleVisibility: function () {
    if(this.model.attributes.visibility) {
      this.model.set({ visibility: false });
      window.mapCanvas.removeLayer(this.model.attributes.lyr);
    } else {
      this.model.set({ visibility: true });
      var lyr = L.tileLayer.wms(this.model.attributes.wms_url, {
        zIndex: 100 - this.$el.index(),
        layers: this.model.attributes.layer_name,
        format: this.model.attributes.format,
        transparent: this.model.attributes.transparent,
        opacity: this.model.attributes.opacity,
        attribution: 'DDSC'
      });
      this.model.set({lyr: lyr});
      window.mapCanvas.addLayer(lyr);
    }
  },
  updateOrder: function() {
    console.log($(this.model.attributes.display_name).index());
  }
});