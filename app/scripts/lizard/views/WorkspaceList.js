Lizard.Views.Workspace = Marionette.ItemView.extend({
  template: '#workspace-template',
  tagName: 'li',
  className: 'drawer-item',
  events: {
    'click input': 'toggle'
  },
  //create a radio button (one workspace selected at a time)
  toggle: function(e) {
    if(this.model.get('selected') === false) {
      this.model.collection.each(function(workspace) {
        workspace.set('selected', false);
      });
      this.model.set('selected', true);
      this.model.trigger('select_workspace', this.model);
    }
  }/*,
  modelEvents: {
    'change:selected': 'modelChanged'
  },
  modelChanged: function() {
    if (this.model.get('hidden') === true ) {
      this.$el._addClass("hidden");
    } else {
      this.$el._removeClass("hidden");
    }
  }*/
});

Lizard.Views.WorkspaceCollection = Backbone.Marionette.CollectionView.extend({
  initialize: function (options) {
    this.workspaceView = options.workspaceView;
    this.collection.fetch();
    this.listenTo(this.collection,
      "select_workspace",
      this.selectWorkspace,
      this
    );
  },
  workspaceView: null,
  collection: null, //workspaceCollection,
  tagName: 'ul',
  className: 'wms_sources',
  itemView: Lizard.Views.Workspace, //todo: make radio button
  selectWorkspace: function(selectedModel) {
    this.workspaceView.setWorkspace(selectedModel);
  },
  onDomRefresh: function () {
    $('.drawer-group').disableSelection();
  }
});
