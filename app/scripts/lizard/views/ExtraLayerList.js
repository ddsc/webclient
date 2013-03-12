//todo: maak items aan/uit
//todo: selecteer na selecteren workspace
//todo: verwijder items


Lizard.Views.LayerListItem = Backbone.Marionette.ItemView.extend({
  template: '#layeritem-template',
  tagName: 'li',
  initialize: function () {
    this.model.bind('change', this.render);
    this.model.set('id',this.model.get('url'));
  },
  onBeforeRender: function () {
    this.el.setAttribute("id", this.model.attributes.id);

  },
  events: {
    'click .layer-item': 'addtoWorkspace'
  },
  addtoWorkspace: function () {
    if(this.model.attributes.selected) {
      this.model.set({ inworkspace: false }); //todo: remove from workspace
    } else {
      this.model.set({ inworkspace: true });
      this.model.trigger('pushtoWorkspace', this.model);
    }
  }
});


Lizard.Views.LayerList = Backbone.Marionette.CollectionView.extend({
  initialize: function (options) {
    this.workspace = options.workspace;
    this.collection.fetch();
    this.listenTo(this.collection, 
      "pushtoWorkspace",
      this.pushtoWorkspace,
      this
    );
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
      this.workspace.add(newmodel);
    } else {
      this.workspace.remove(workspacemodel[0]);   
    }
  }
});