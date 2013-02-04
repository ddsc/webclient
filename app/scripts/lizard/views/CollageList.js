Lizard.views.Collage = Backbone.Marionette.ItemView.extend({
    tagName: 'li',
    template: '#name-template',
    events: {
        'click .collageItem': 'selectItem'
    },
    selectItem: function() {
        this.trigger('selectItem', this.model);
    }
});

Lizard.views.CollageList = Backbone.Marionette.CollectionView.extend({
    itemView: Lizard.views.Collage
});
