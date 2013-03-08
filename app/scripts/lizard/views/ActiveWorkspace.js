Lizard.Views.WorkspaceItem = Backbone.Marionette.ItemView.extend({
  template: '#workspaceitem-template',
  tagName: 'li',
  className: 'drawer-item',
  initialize: function () {
    this.model.bind('change', this.render);
    this.model.set('id', this.model.get('url'));
  },
  onBeforeRender: function () {
    this.el.setAttribute("id", this.model.attributes.id);
  },
  events: {
    'click .layer-item .indicator': 'toggleVisibility',
    'click .layer-item .content': 'select'
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
  events: {
    drop: 'drop'
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
  },
  appendHtml: function(collectionView, itemView, index){
    collectionView.$el.append(itemView.el);
    // render extra element to add maplayers
    if (collectionView.$el.find('#maplayers').html() === undefined){
      // but append it to the bottom of the list
      if (collectionView.collection.length === index + 1){
        var htmlcontent = '<li id="maplayers" class="drawer-handle">\
                            <div class="layer-item">\
                            <span class="action handle ">\
                            <i class="icon-plus"></i></span>\
                            Voeg Extra Kaartlaag toe \
                            <div id="extramaplayers" class="hidden"></div>\
                            </div></li>'
          collectionView.$el.append(htmlcontent);
          var extraLayersView = new Lizard.Views.LayerList({
            collection: layerCollection,
            workspace: Lizard.workspaceView.collection
          });
          extraLayersView.on('render', function(renderedView){
            $('li#maplayers').popover({
              title: "Kies een kaartlaag",
              html: true,
              content: function(){
                return $('#extramaplayers').html();
              }
            });
          });
          Lizard.mapView.extraLayerRegion.show(extraLayersView.render());
      }
    } else {
      // move the extra button to the bottom again
      var maplayers = $('#maplayers')
        maplayers.insertAfter(maplayers.siblings());
    }
  }
});