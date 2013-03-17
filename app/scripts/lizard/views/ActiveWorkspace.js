Lizard.Views.WorkspaceItem = Backbone.Marionette.ItemView.extend({
  template: '#workspaceitem-template',
  tagName: 'li',
  className: 'drawer-item',
  initialize: function () {
    this.model.bind('change:selected change:visibility', this.render, this);
  },
  onBeforeRender: function () {
    this.el.setAttribute("id", this.model.cid);
  },
  onRender: function() {
    var that = this;
    that.$el.find('.opacity-slider').slider({
        value: that.model.get('opacity'),
        min: 0,
        max: 100,
        range: "min",
        step: 1,
        create: function( event, ui ) {
          //that.model.unbind('change:opacity'); // This prevents the item from re-rendering...
        },
        slide: function( event, ui ) {
          that.model.set('opacity', ui.value);
        },
        stop: function( event, ui ) {
          that.model.set('opacity', ui.value);
          $('.top-right').notify({
            message: {
              text: 'Transparantie van kaartlaag "' + that.model.get('display_name') + '" is nu ' + ui.value + '%'
            }}).show();
        }
    });
  },
  events: {
    'click .layer-item .indicator': 'toggleVisibility',
    'click .layer-item .content': 'select',
    'click .layer-item .toggle-layer-configuration': 'toggleLayerConfiguration',
    'click .layer-item .btn-delete-layer': 'removeLayer'
  },
  removeLayer: function(e) {
    // The collection belonging to this model, is not the same
    // as the workspace it is in.
    this.model.trigger('removeItem', this.model);
  },
  toggleLayerConfiguration: function() {
    $(this.el).find('.layer-configuration').toggle('fast');
    $(this.el).find('.toggle-layer-configuration i').toggleClass('chevron-closed chevron-open');
  },
  toggleVisibility: function () {
    if(this.model.attributes.visibility) {
      this.model.set({ visibility: false });
    } else {
      this.model.set({ visibility: true });
    }
  },
  select: function(e) {
    if(this.model.get('selected') === false) {
      this.model.collection.each(function(workspaceItem) {
        workspaceItem.set('selected', false);
      });
      this.model.set('selected', true);
      //this.model.trigger('select_layer', this.model);
    }
  }
});

Lizard.Views.ActiveWorkspace = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.Collections.Layer(), //layerCollection,
  tagName: 'ol',
  className: 'ui-sortable drawer-group wms_sources',
  itemView: Lizard.Views.WorkspaceItem,
  emptyView: Marionette.ItemView.extend({
    template: "#empty-workspace-list-message"
  }),
  events: {
    drop: 'drop'
  },
  initialize: function() {
    this.collection.on('reset', this.render, this);
    this.collection.on('removeItem', this.removeItem, this);
    this.collection.on('add remove', this.render, this);
    this.on('render', this.afterRender, this);
  },
  _initialEvents: function(){
    //this.collection.on("removeItems", this.onItemRemoveds, this);
  },
  drop: function(event, args) {
    this.collection.move(args.item, args.index);
    this.collection.updateOrderFieldOfItems();
  },
  setWorkspace: function(workspace) {
    this.model = workspace;
    this.collection.reset(workspace.get('workspaceitems').models);
  },
  removeItem: function(model) {
    this.collection.remove(model);
  },
  onShow: function () {
    var that = this;
    $('.drawer-group').sortable({
      stop: function(event, ui) {
        var item = that.collection.get({cid: ui.item.attr('id')});
        ui.item.trigger('drop', {
          item: item,
          index: ui.item.index()
        });
      }
    });
    $('.drawer-group').disableSelection();
  },
  getCollection: function() {
    return this.collection;
  }
});


