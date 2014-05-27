Lizard.Views.Workspace = Marionette.ItemView.extend({
  template: '#workspace-template',
  tagName: 'li',
  className: 'drawer-item',
  initialize: function () {
    this.model.bind('change', this.render);
  },
  events: {
    'click .layer-item': 'select'
  },
  //create a radio button (one workspace selected at a time)
  select: function(e) {
    this.model.collection.each(function(workspace) {
      workspace.set('selected', false);
    });
    // debugger
    this.model.set('selected', true);
    this.model.trigger('select_workspace', this.model);
  }
});

Lizard.Views.WorkspaceCollection = Backbone.Marionette.CollectionView.extend({
  initialize: function (options) {
    this.workspaceView = options.workspaceView;
    this.listenTo(this.collection,
      "select_workspace",
      this.selectWorkspace,
      this
    );
  },
  workspaceView: null,
  collection: null, //workspaceCollection,
  tagName: 'ul',
  className: 'wms_sources drawer-group',
  itemView: Lizard.Views.Workspace,
  selectWorkspace: function(selectedModel) {
    Lizard.workspaceView.setWorkspace(selectedModel);
    Backbone.history.navigate('map/' + selectedModel.id);
  },
  onShow: function () {
    $('.drawer-group').disableSelection();
  }
});
