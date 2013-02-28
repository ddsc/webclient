Lizard.Views.WorkspaceItem = Backbone.Marionette.ItemView.extend({
  template: '#layeritem-template',
  tagName: 'li',
  className: 'drawer-item',
  initialize: function () {
    this.model.bind('change', this.render);
    this.model.set('id',this.model.get('url'));
  },
  onBeforeRender: function () {
    this.el.setAttribute("id", this.model.attributes.id);
  },
  events: {
    'click .layer-item .indicator': 'toggleVisibility'
  },
  toggleVisibility: function () {
    if(this.model.attributes.visibility) {
      this.model.set({ visibility: false });
    } else {
      this.model.set({ visibility: true });
    }
  },
  updateOrder: function() {
    console.log($(this.model.attributes.display_name).index());
  }

});

Lizard.Views.ActiveWorkspace = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.Collections.Layer(), //layerCollection,
  tagName: 'ul',
  className: 'ui-sortable drawer-group wms_sources',
  itemView: Lizard.Views.WorkspaceItem,
  events: {
    drop: 'drop'
  },
  drop: function(event, args) {
    this.collection.move(args.item, args.index);
  },
  onShow: function () {
    var that = this;
    $('.drawer-group').sortable({
      stop: function(event, ui) {
        var item = that.collection.get(ui.item.attr('id'));
        ui.item.trigger('drop', {item: item, index: ui.item.index()});
      }
    });

    /*onShow: function () {
     $('.drawer-group').draggable('destroy').draggable({
     connectToSortable: '#workspaceRegion',
     revert: "invalid",
     containment: '#weetnietwatditis',
     helper: function(e, ui) {
     return $(this).clone().css()
     }
     });*/
    $('.drawer-group').disableSelection();
  },
  setWorkspace: function(workspace) {
    this.collection.reset(workspace.get('workspaceitems').models);
  }
});