Lizard.Views.AnnotationsView = Backbone.Marionette.ItemView.extend({
    //tagName: 'div',
    template: '#annotations-template',
    initialize: function (){
        console.debug('AnnotationsView.init');
        this.listenTo(this.model, "change", this.render, this);
        setTimeout(this.setIsLoading.bind(this, false), 2000);
    },
    triggers: {
        //"click .do-something": "something:do:it"
    },
    onDomRefresh: function(){
        // manipulate the `el` here. it's already
        // been rendered, and is full of the view's
        // HTML, ready to go.
        console.debug('AnnotationsView.onDomRefresh');
    },
    setIsLoading: function (isLoading) {
        this.model.set('isLoading', isLoading);
    },
    modelChanged: function(model, value){
        console.debug('AnnotationsView.modelChanged');
    },
    modelEvents: {
        "change:isLoading": function(){
            console.debug('AnnotationsView.modelEvents.change:isLoading');
        }
    },
    onBeforeClose: function(){
        // returning false prevents the view from being closed
        return true;
    },
    onClose: function(){
        // custom cleanup or closing code, here
        console.debug('AnnotationsView.onClose');
    },
    templateHelpers: {
        showMessage: function(){
            return 'hoi';
        }
    }
});
