Lizard.Models.Workspace = Backbone.Model.extend({
  relations: [{
    type: Backbone.Many, //nature of the relationship
    key: 'workspaceitems', //attribute of collage relating to workspaceItems
    relatedModel: 'Lizard.Models.WorkspaceItem' //AssociatedModel for attribute key
  }],
  initialize: function (model) {
    var workspaceitems = [];
    for (var i = 0; i < model.workspaceitems.length; i++) {
      var workspaceitem = new Lizard.Models.WorkspaceItem(model.workspaceitems[i]);
      workspaceitems.push(workspaceitem);
    }
    var newCollection = new Backbone.Collection(workspaceitems);
    this.set('workspaceitems', newCollection);
  },
  defaults: {
    name: '',
    id: null,
    selected: false,
    icon: 'icon-globe'
  }
});
