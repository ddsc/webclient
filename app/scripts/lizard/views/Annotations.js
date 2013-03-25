Lizard.Views.AnnotationsView = Backbone.Marionette.ItemView.extend({
    //tagName: 'div',
    template: '#annotations-template',
    mapCanvas: null,
    mapCanvasEvent: null,
    annotationLayer: null,
    currentXhr: null,
    initialize: function(options){
        console.debug('AnnotationsView.init');
        this.mapCanvas = options.mapView.mapCanvas;
        this.createAnnotationsLayer();
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
    createAnnotationsLayer: function(){
        var self = this;
        this.annotationLayer = new L.LayerGroup();
        // for (var i=0; i<6; i++){
          // var point = new L.LatLng(latlngs[i][0], latlngs[i][1]);
          // var popup =  new L.popup().setContent('<div><h4>Kwel bij hoogwater '+
            // '<span class="author pull-right">21 November 2011</span></h4>'+
            // '<img src="images/kwel.jpg" style="width: 100%"/>'+
            // 'Kwel bij hoogwater. Zandzakken geplaatst om te verlichten. - Jan de Graaf</div>');
          // var marker = new L.Marker(point).bindPopup(popup);
          // marker.addTo(annotationLayer);
        // }

        $('.annotation-layer-toggler').click(function(e) {
            var $icon = $(this).find('i');
            if ($icon.hasClass('icon-check-empty')) {
                $icon.addClass('icon-check').removeClass('icon-check-empty');
                self.mapCanvas.addLayer(self.annotationLayer);
                // ensure the annotations are redrawn
                self.updateAnnotations();
            }
            else {
                $icon.addClass('icon-check-empty').removeClass('icon-check');
                self.mapCanvas.removeLayer(self.annotationLayer);
            }
        });
    },
    updateAnnotationsLayer: function(annotations){
        this.annotationLayer.clearLayers();
        for (var i=0; i<annotations.length; i++) {
            var a = annotations[i];
            try {
                var marker = L.marker(a.location);
                var popup = L.popup()
                    .setContent(a.text);
                marker.bindPopup(popup);
                this.annotationLayer.addLayer(marker);
            }
            catch (ex) {
                console.error('Failed to add an annotation marker.');
            }
        }
    },
    buildQueryUrlParams: function(){
        console.debug('AnnotationsView.buildQueryUrl');
        var bbox = this.mapCanvas ? this.mapCanvas.getBounds().toBBoxString() : null;
        return {
            category: 'ddsc',
            bbox: bbox
        };
    },
    updateAnnotations: function(){
        var self = this;
        // dont retrieve annotations, when the layer
        // has been deactivated
        var url = this.mapCanvas.hasLayer(this.annotationLayer) ?
            settings.annotations_search_url :
            settings.annotations_count_url;
        var urlParams = this.buildQueryUrlParams();

        // abort previous XHR
        if (this.currentXhr !== null) {
            this.currentXhr.abort();
            this.currentXhr = null;
        }

        // enable the spinner
        this.setIsLoading(true);

        // start a new XHR
        this.currentXhr = $.ajax({
            url: url,
            data: urlParams,
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            self.model.set({
                annotationsCount: data.count
            });
            // hack: update the toggler as well
            $('.annotation-layer-toggler .badge').text(data.count);
            if (data.result) {
                self.updateAnnotationsLayer(data.results);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Error while retrieving exceptions.');
        })
        .complete(function (jqXHR) {
            if (jqXHR == self.currentXhr) {
                self.currentXhr = null;
            }
            self.setIsLoading(false);
        });
    },
    setIsLoading: function(isLoading) {
        this.model.set({
            'isLoading': isLoading
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
