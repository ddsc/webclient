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
  onRender: function() {
    $('.opacity-slider').slider({
        value:100,
        min: 0,
        max: 100,
        range: "min",
        step: 1,
        stop: function( event, ui ) {
          console.log(ui.value);
          $('.top-right').notify({message: {text: 'Transparantie op ' + ui.value + '%'}}).show();
        }
    });
  },
  events: {
    'click .layer-item .indicator': 'toggleVisibility',
    'click .layer-item .content': 'select',
    'click .layer-item .toggle-layer-configuration': 'toggleLayerConfiguration'
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
  emptyView: Marionette.ItemView.extend({
    template: "#empty-workspace-list-message"
  }),
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
  onClose: function(){
    console.log('closing', this);
  },
  /*appendHtml: function(collectionView, itemView, index){
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
                            </div></li>';
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
      var maplayers = $('#maplayers');
        maplayers.insertAfter(maplayers.siblings());
    }
  }*/
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