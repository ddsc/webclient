Lizard.collections.Annotation = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("annotations"),
	model: Lizard.models.Annotation
});
