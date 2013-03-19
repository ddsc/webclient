Lizard.Models.Annotation = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("annotations"),
	model: Lizard.Models.Annotation
});