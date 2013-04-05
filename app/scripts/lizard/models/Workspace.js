Lizard.Models.Workspace = Backbone.AssociatedModel.extend({
  relations: [{
    type: Backbone.Many, //nature of the relationship
    key: 'workspaceitems', //attribute of collage relating to workspaceItems
    relatedModel: Lizard.Models.WorkspaceItem //AssociatedModel for attribute key
  }],
  defaults: {
    name: '',
    id: null,
    selected: false,
    icon: 'icon-globe'
  }
});
