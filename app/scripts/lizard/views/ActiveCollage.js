Lizard.views.ActiveCollageHeader = Backbone.Marionette.ItemView.extend({
    //tagName: 'div',
    template: '#name-template',
});

Lizard.views.ActiveCollage = Backbone.Marionette.Layout.extend({
    template: '#activecollage',

    regions: {
        header: '#active_collage_header',
        collage_item_list: '#collage_item_list',
		footer: '#new_collage_item'
    },

	events: {
		'keypress #new-collage-item': 'createOnEnter',
	},

	createOnEnter: function(event){
		var ENTER_KEY = 13;
		var input = $('#new-collage-item');
		var val = input.val().trim();
		if (event.which !== ENTER_KEY|| !val) {
			return;
		}
		new_item = activeCollageItems.create({
			name: val,
			collage: this._header.model.url()
		});
		input.val('');
		this._collage_item_list.render();
	},

	// Broken working code.
	// The intialize and setCollage function give headaches in other part
	// of the code.
	// the  this._collage_item_list must be rerendered in a couple of places.

    setCollage: function(collage) {
        this._header.model = collage;
        this.header.show(this._header.render());
        this.collection.reset();
        this.collection.add(collage.get('collageitems').models);
        this.collage_item_list.show(this._collage_item_list.render());
    },
    initialize: function () {
        this._header = new Lizard.views.ActiveCollageHeader({model: this.model});
        this.header.show(this._header.render());
        this._collage_item_list = new Lizard.views.CollageItemList({collection: this.collection});
        this.collage_item_list.show(this._collage_item_list.render());
    }
});
