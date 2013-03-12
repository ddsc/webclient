Lizard.Views.AnnotationsView = Backbone.Marionette.ItemView.extend({
    //tagName: 'div',
    template: '#annotations-template',
    mapView: null,
    loadingTimeout: null,
    initialize: function(options){
        console.debug('AnnotationsView.init');
        this.mapView = options.mapView;
        this.listenTo(this.model, "change", this.render, this);
        if (this.mapView) {
            this.listenTo(this.mapView.mapCanvas, "moveend", this.updateAnnotations, this);
        }
        this.updateAnnotations();
    },
    events: {
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
    updateAnnotations: function(){
        if (this.mapView) {
            var c = this.mapView.mapCanvas.getCenter();
            var z = this.mapView.mapCanvas.getZoom();
        }
        // pretend to be loading annotations
        var self = this;
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }
        if (!this.model.isLoading) {
            this.setIsLoading(true);
        }
        this.loadingTimeout = setTimeout(
            function(){
                self.setIsLoading(false);
            },
            2000
        );
    },
    setIsLoading: function(isLoading) {
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
