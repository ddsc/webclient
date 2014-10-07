Lizard.Models.Collage = Backbone.Model.extend({
  relations: [{
    type: Backbone.Many, //nature of the relationship
    key: 'collageitems', //attribute of collage relating to workspaceItems
    relatedModel: 'Lizard.Models.CollageItem' //AssociatedModel for attribute key
  }],
  initialize: function (model) {
    var collageitems = [];
    for (var i = 0; i < model.collageitems.length; i++) {
      var collageitem = new Lizard.Models.CollageItem(model.collageitems[i]);
      collageitems.push(collageitem);
    }
    var newCollection = new Backbone.Collection(collageitems);
    this.set('collageitems', newCollection);
  },
  defaults: {
    name: '',
    id: null,
    selected: false,
    icon: 'icon-globe'
  },
  url: function() {
    var origUrl = this.get('url');
    return origUrl += _.last(origUrl) === '/' ? '' : '/';
  }
});
