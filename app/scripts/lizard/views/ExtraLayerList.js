//todo: maak items aan/uit
//todo: selecteer na selecteren workspace
//todo: verwijder items


Lizard.Views.LayerListItem = Backbone.Marionette.ItemView.extend({
  template: '#layeritem-template',
  tagName: 'li',
  initialize: function () {
    this.model.set('id',this.model.get('url'));
    this.model.on('change', this.render);
  },
  onBeforeRender: function () {
    this.el.setAttribute("id", this.model.attributes.id);
  },
  events: {
    'click .layer-item': 'addtoWorkspace'
  },
  addtoWorkspace: function () {
    this.model.trigger('pushtoWorkspace', this.model);
  }
});


Lizard.Views.LayerList = Backbone.Marionette.CollectionView.extend({
  initialize: function (options) {
    var that = this;
    this.workspace = options.workspace;
    this.collection.fetch({
      success: function(collection) {
        that.syncWorkspaceItemCollection();
      }
    });
    this.listenTo(this.collection,
      "pushtoWorkspace",
      this.pushtoWorkspace,
      this
    );
    this.listenTo(this.workspace,
      "reset",
      this.syncWorkspaceItemCollection,
      this
    );
    this.listenTo(this.workspace,
      "add",
      this.workspaceItemAdded,
      this
    );
    this.listenTo(this.workspace,
      "remove",
      this.workspaceItemRemoved,
      this
    );
  },
  syncWorkspaceItemCollection: function() {
    var that = this;
    this.collection.each(function(model){
      model.set('addedToMap', false);
    });
    this.workspace.each(function(workspaceitem){
      var wms_source_name = workspaceitem.get('wms_source').display_name;
      var extralayersmodel = that.collection.where({display_name: wms_source_name});
      if (extralayersmodel.length > 0) {
        extralayersmodel[0].set('addedToMap', true);
      }
    });
  },
  workspaceItemAdded: function(workspaceItem) {
    var models = this.collection.where({display_name: workspaceItem.get('display_name')});
    models[0].set({'addedToMap': true});
  },
  workspaceItemRemoved: function(workspaceItem) {
    var models = this.collection.where({display_name: workspaceItem.get('display_name')});
    models[0].set({'addedToMap': false});
  },
  collection: null, //layerCollection,
  workspace: null,
  tagName: 'ul',
  className: 'wms_sources',
  itemView: Lizard.Views.LayerListItem,
  pushtoWorkspace: function(model) {
    var workspacemodel = this.workspace.where({display_name: model.get('display_name')});
    if (workspacemodel.length === 0){
      newmodel = new Lizard.Models.WorkspaceItem({
        wms_source:model.toJSON(),
        visibility:true,
        display_name: model.get('display_name'),
        type:  model.get('type')
      });
      this.workspace.add(newmodel, {at:0});
      this.workspace.updateOrderFieldOfItems();
    } else {
      this.workspace.remove(workspacemodel[0]);
    }
  }
});