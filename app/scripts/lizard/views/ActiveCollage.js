
Lizard.views.ActiveCollageHeader = Backbone.Marionette.ItemView.extend({
    //tagName: 'div',
    template: '#name-template'
});

Lizard.views.CollageItem = Backbone.Marionette.ItemView.extend({
    //tagName: "tr",
    ui: {
        checkbox: "input[type=checkbox]"
    },
    onRender: function() {
        //if (this.model.get('id')>1) {
        this.ui.checkbox.addClass('checked');
        //}
    },
    template: '#name-checkbox'
});

Lizard.views.CollageItemList = Backbone.Marionette.CollectionView.extend({
    itemView: Lizard.views.CollageItem
});

Lizard.views.ActiveCollage = Backbone.Marionette.Layout.extend({
    template: '#activecollage',

    regions: {
        header: '#active_collage_header',
        collage_item_list: '#collage_item_list'
    },
    setCollage: function(collage) {
        this._header.model = collage;
        this.header.show(this._header.render());
        this.collection.reset();
        this.collection.add(collage.get('collageitems').models);
        this.collage_item_list.show(this._collage_item_list.render());
    },
    initialize: function () {
        this._header = new Lizard.views.ActiveCollageHeader({model: this.model})
        this.header.show(this._header.render());
        this._collage_item_list = new Lizard.views.CollageItemList({collection: this.collection});
        this.collage_item_list.show(this._collage_item_list.render());
    }
});
