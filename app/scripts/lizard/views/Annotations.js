Lizard.Views.AnnotationsView = Backbone.Marionette.ItemView.extend({
    //tagName: 'div',
    template: '#annotations-template',
    mapCanvas: null,
    mapCanvasEvent: null,
    loadingTimeout: null,
    initialize: function(options){
        console.debug('AnnotationsView.init');
        this.mapCanvas = options.mapView.mapCanvas;
        this.listenTo(this.model, "change", this.render, this);
        if (this.mapCanvas) {
            // This won't work, because Leaflet only pretends to support jQuery events.
            //this.listenTo(this.mapCanvas, "moveend", this.updateAnnotations, this);
            this.mapCanvasEvent = this.updateAnnotations.bind(this);
            this.mapCanvas.on("moveend", this.mapCanvasEvent);
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
        if (this.mapCanvas) {
            var c = this.mapCanvas.getCenter();
            var z = this.mapCanvas.getZoom();
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
        this.model.set({
            'isLoading': isLoading,
            'annotationsCount': Math.round(Math.random() * 20 + 2)
        });
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
        if (this.mapCanvasEvent) {
            this.mapCanvas.off("moveend", this.mapCanvasEvent);
        }
    },
    templateHelpers: {
        showMessage: function(){
            return '...';
        }
    }
});
