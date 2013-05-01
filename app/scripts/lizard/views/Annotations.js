Lizard.Views.AnnotationsView = Backbone.Marionette.ItemView.extend({
    //tagName: 'div',
    template: '#annotations-template',
    mapCanvas: null,
    mapCanvasEvent: null,
    annotationLayer: null,
    currentXhr: null,
    initialize: function (options) {
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
        Lizard.App.vent.on("makeAnnotation", Lizard.Views.CreateAnnotationView);
        Lizard.App.vent.on("savedpopup", this.updateAnnotations, this);
    },
    events: {
    },
    triggers: {
        //"click .do-something": "something:do:it"
    },
    onDomRefresh: function () {
        // manipulate the `el` here. it's already
        // been rendered, and is full of the view's
        // HTML, ready to go.
    },
    createAnnotationsLayer: function () {
        var self = this;
        this.annotationLayer = new L.LayerGroup();
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
    updateAnnotationsLayer: function (annotations) {
        this.annotationLayer.clearLayers();
        for (var i=0; i<annotations.length; i++) {
            var a = annotations[i];
            if (a.location) {
                try {
                    var marker = L.marker(a.location);
                    var html = this.annotation2html(a);
                    var popup = L.popup({
                        autoPan: false,
                        zoomAnimation: false
                    })
                    .setContent(html);
                    marker.bindPopup(popup);
                    this.annotationLayer.addLayer(marker);
                }
                catch (ex) {
                    console.error('Failed to add an annotation marker: ' + ex);
                }
            }
        }
    },
    buildQueryUrlParams: function () {
        var bbox = this.mapCanvas ? this.mapCanvas.getBounds().toBBoxString() : null;
        return {
            category: 'ddsc',
            bbox: bbox
        };
    },
    updateAnnotations: function () {
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
            if (data.results) {
                self.updateAnnotationsLayer(data.results);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Error while retrieving annotations.');
        })
        .complete(function (jqXHR) {
            if (jqXHR == self.currentXhr) {
                self.currentXhr = null;
            }
            self.setIsLoading(false);
        });
    },
    setIsLoading: function (isLoading) {
        this.model.set({
            'isLoading': isLoading
        });
    },
    modelChanged: function (model, value) {
    },
    modelEvents: {
        "change:isLoading": function (){
        }
    },
    onBeforeClose: function () {
        // returning false prevents the view from being closed
        return true;
    },
    onClose: function () {
        // custom cleanup or closing code, here
        if (this.mapCanvasEvent) {
            this.mapCanvas.off("moveend", this.mapCanvasEvent);
        }
    },
    templateHelpers: {
        showMessage: function (){
            return '...';
        }
    },
    annotation2html: function (a) {
        var created_at = 'n.v.t.';
        if (a.created_at) {
            created_at = new Date(a.created_at);
            created_at = created_at.toLocaleString();
        }

        var datetime_from = 'n.v.t.';
        if (a.datetime_from) {
            datetime_from = new Date(a.datetime_from);
            datetime_from = datetime_from.toLocaleString();
        }

        var datetime_until = 'n.v.t.';
        if (a.datetime_until) {
            datetime_until = new Date(a.datetime_until);
            datetime_until = datetime_until.toLocaleString();
        }

        var title = '';
        if (a.related_model_str) {
            title = 'Annotatie bij ' + a.related_model_str;
        }
        else {
            title = 'Annotatie ' + a.id;
        }

        var annoModel = new Backbone.Model(a);
        var annotationPopup = new Lizard.Views.AnnotationPopupView({model: annoModel});
        var html = annotationPopup.render().el;
        return html
    }
});


// Fixes the z-index of the datepicker which appeared behind the modal
$('.datepick-annotate').live('focus', function(e) {
    $('#ui-datepicker-div').css('z-index', 10000);
});


Lizard.Views.AnnotationPopupView = Backbone.Marionette.ItemView.extend({
    template: '#annotation-popup',
    initialize: function(options){
        this.model = options.model
    }
});

