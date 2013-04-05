Lizard.Views.AnnotationsView = Backbone.Marionette.ItemView.extend({
    //tagName: 'div',
    template: '#annotations-template',
    mapCanvas: null,
    mapCanvasEvent: null,
    annotationLayer: null,
    currentXhr: null,
    initialize: function (options) {
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
    onDomRefresh: function () {
        // manipulate the `el` here. it's already
        // been rendered, and is full of the view's
        // HTML, ready to go.
        console.debug('AnnotationsView.onDomRefresh');
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
                console.error('Failed to add an annotation marker.');
            }
        }
    },
    buildQueryUrlParams: function () {
        console.debug('AnnotationsView.buildQueryUrl');
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
            console.error('Error while retrieving exceptions.');
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
        console.debug('AnnotationsView.modelChanged');
    },
    modelEvents: {
        "change:isLoading": function (){
            console.debug('AnnotationsView.modelEvents.change:isLoading');
        }
    },
    onBeforeClose: function () {
        // returning false prevents the view from being closed
        return true;
    },
    onClose: function () {
        // custom cleanup or closing code, here
        console.debug('AnnotationsView.onClose');
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

        var html = '';
        html += '<h4>' + title + '</h4>';
        html += '<p>' + a.text + '</p>';
        if (a.picture_url) {
            html += '<hr/>';
            // extra style="" is needed to override a leaflet CSS !important statement
            html += '<div><img src="'+ a.picture_url +'" alt="'+ a.picture_url +'" style="max-width: 100% !important" /></div>';
        }
        html += '<hr/>';
        html += '<div class="author">Aangemaakt door ' + a.username + ' op ' + created_at + '</div>';
        html += '<p></p>';
        html += '<table class="table table-condensed table-bordered" style="font-size: 80%;">';
        //html += '<tr><td>Aangemaakt door</td><td>' + a.username + '</td></tr>';
        //html += '<tr><td>Aangemaakt op</td><td>' + created_at + '</td></tr>';
        html += '<tr><td>Geldig van</td><td>' + datetime_from + '</td></tr>';
        html += '<tr><td>Geldig tot</td><td>' + datetime_until + '</td></tr>';
        html += '<tr><td>Tags</td><td>' + a.tags + '</td></tr>';
        html += '</table>';
        return html;
    }
});
