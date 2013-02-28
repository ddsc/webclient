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
    'click .layer-item .indicator': 'toggleVisibility'
  },
  toggleVisibility: function () {
    if(this.model.attributes.selected) {
      this.model.set({ selected: false }); //todo: remove from workspace
    } else {
      this.model.set({ selected: true });
      this.model.trigger('add_to_workspace', this.model);
    }
  }
});


Lizard.Views.LayerList = Backbone.Marionette.CollectionView.extend({
  initialize: function (options) {
    this.workspace = options.workspace;
    this.collection.fetch();
    this.listenTo(this.collection, 
      "add_to_workspace",
      this.add_to_workspace,
      this
    );
  },
  collection: null, //layerCollection,
  workspace: null,
  tagName: 'ul',
  className: 'wms_sources',
  itemView: Lizard.Views.LayerListItem,
  add_to_workspace: function(model) {
    this.workspace.push(new Lizard.Models.WorkspaceItem({
      wms_source:model.toJSON(), 
      visibility:true,
      display_name: model.get('display_name'), 
      type:  model.get('type') 
    }));
  }
});