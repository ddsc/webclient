Lizard.Views.WorkspaceItem = Backbone.Marionette.ItemView.extend({
  template: '#workspaceitem-template',
  tagName: 'li',
  className: 'drawer-item',
  initialize: function () {
    this.model.bind('change', this.render);
    this.model.set('id', this.model.get('url'));
    window.collectionJantje = this;
  },
  onBeforeRender: function () {
    this.el.setAttribute("id", this.model.attributes.id);
  },
  onRender: function() {
    var that = this;
    $('.opacity-slider').slider({
        value: that.model.get('opacity'),
        min: 0,
        max: 100,
        range: "min",
        step: 1,
        stop: function( event, ui ) {
          that.model.unbind('change'); // This prevents the item from re-rendering...
          that.model.set('opacity', ui.value);
          $('.top-right').notify({
            message: {
              text: 'Transparantie ' + ui.value + '%'
            }}).show();
        }
    });
  },
  events: {
    'click .layer-item .indicator': 'toggleVisibility',
    'click .layer-item .content': 'select',
    'click .layer-item .toggle-layer-configuration': 'toggleLayerConfiguration',
    'click .layer-item .btn-delete-layer': 'deleteLayer'
  },
  deleteLayer: function(e) {
    // The collection belonging to this model, is not the same
    // as the workspace it is in.
    Lizard.App.vent.trigger('removeItem', this.model);
  },
  toggleLayerConfiguration: function() {
    $(this.el).find('.layer-configuration').toggle('fast');
    $(this.el).find('.toggle-layer-configuration i').toggleClass('icon-chevron-right icon-chevron-down');
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

Lizard.Views.WorkspaceItemList = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.Collections.Layer(), //layerCollection,
  tagName: 'ol',
  className: 'ui-sortable drawer-group wms_sources',
  itemView: Lizard.Views.WorkspaceItem,
  initialize: function () {
    Lizard.App.vent.on('removeItem', _.bind(this.onItemRemoved, this));
  },
  emptyView: Marionette.ItemView.extend({
    template: "#empty-workspace-list-message"
  }),
  events: {
    drop: 'drop',
  },
  drop: function(event, args) {
    this.collection.move(args.item, args.index);
    this.updateOrderFieldOfItems();
    //args.item.set({order: args.index});
    //args.item.attributes.layer.leafletLayer.setZIndex(100 - args.index);
  },
  updateOrderFieldOfItems: function() {
    index=0;
    this.collection.each(function(workspaceItem) {
      workspaceItem.set('order',index);
      index = index + 1;
    });
  },
  onItemRemoved: function(model) {
    this.collection.remove(model);
  },
  onShow: function () {
    var that = this;
    $('.drawer-group').sortable({
      stop: function(event, ui) {
        var item = that.collection.get(ui.item.attr('id'));
        ui.item.trigger('drop', {
          item: item,
          index: ui.item.index()
        });
      }
    });
    $('.drawer-group').disableSelection();
  },
  setWorkspace: function(workspace) {
    this.collection.reset(workspace.get('workspaceitems').models);
  onClose: function(){
    console.log('closing', this);
  }
});

Lizard.Views.ActiveWorkspace = Backbone.Marionette.Layout.extend({
  template: "#template-layout-active-workspace",
  workspaceItemListView: null,
  model: null,
  buttonExtraLayersAdded: false,
  regions: {
    list: "#list",
    workspaceItemRegion: "#workspaceRegion"
  },

  initialize: function() {
    this.workspaceItemListView = new Lizard.Views.WorkspaceItemList();
    this.model = new Lizard.Models.Workspace();
    this.on('render', this.renderCollection, this);
  },
  setWorkspace: function(workspace) {
    this.model = workspace;
    this.workspaceItemListView.collection.reset(workspace.get('workspaceitems').models);
    this.render();

  },
  renderCollection: function() {

    this.workspaceItemRegion.show(this.workspaceItemListView);
    if (!this.buttonExtraLayersAdded) {
      this.workspaceItemListView.$el.append('\
        <li id="extra-maplayer-button" class="drawer-handle"> \
          <div class="layer-item">\
            <span class="action handle ">\
              <i class="icon-plus"></i>\
            </span>\
            Voeg Extra Kaartlaag toe \
            <div id="extramaplayers" class="hidden"></div>\
          </div>\
        </li>');
      this.buttonExtraLayersAdded = true;
    } else {
      var button = this.workspaceItemListView.$el.find('#extra-maplayer-button')
      button.remove();
      this.workspaceItemListView.$el.append(button);
    }

  },
  getCollection: function() {
    return this.workspaceItemListView.collection;
  }
});