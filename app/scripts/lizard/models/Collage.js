Lizard.Models.Collage = Backbone.AssociatedModel.extend({
  relations: [{
    type: Backbone.Many, //nature of the relationship
    key: 'collageitems', //attribute of collage relating to workspaceItems
    relatedModel: Lizard.Models.CollageItem //AssociatedModel for attribute key
  }],
  defaults: {
    name: '',
    id: null,
    selected: false,
    icon: 'icon-globe'
  },
  url: function() {
    var origUrl = Backbone.Model.prototype.url.call(this);
    return origUrl += _.last(origUrl) === '/' ? '' : '/';
  }
});