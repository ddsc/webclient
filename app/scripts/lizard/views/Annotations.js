Lizard.Views.AnnotationsView = Backbone.Marionette.ItemView.extend({
    //tagName: 'div',
    template: '#annotations-template',
    enableUpdateAnnotations: true,
    mapCanvas: null,
    annotationLayer: null,
    currentXhr: null,
    initialize: function (options) {
        this.mapCanvas = options.mapView.mapCanvas;
        this.createAnnotationsLayer();
        this.listenTo(this.model, "change", this.render, this);
        if (this.mapCanvas) {
            // This won't work, because Leaflet only pretends to support jQuery events.
            //this.listenTo(this.mapCanvas, "moveend", this.updateAnnotations, this);
            this.mapCanvas.on("moveend", this.updateAnnotations, this);
            this.mapCanvas.on("popupopen", this.popupOpen, this);
            this.mapCanvas.on("popupclose", this.popupClose, this);
        }
        this.updateAnnotations();
        Lizard.App.vent.on("makeAnnotation", Lizard.Views.CreateAnnotationView);
        Lizard.App.vent.on("updateAnnotationsMap", this.updateAnnotations, this);
        self = this;
        Lizard.App.vent.on("changedestroyAnnotation", function(){
            self.enableUpdateAnnotations = true;
            self.updateAnnotations();
        });
    },
    popupOpen: function () {
        this.enableUpdateAnnotations = false;
    },
    popupClose: function () {
        this.enableUpdateAnnotations = true;
    },
    onRender: function () {
        // listening to event that comes from Map.js
        Lizard.App.vent.on('mapLoaded', function () {
            this.annotationLayer = new L.MarkerClusterGroup({
                  spiderfyOnMaxZoom: true,
                  showCoverageOnHover: false,
                  maxClusterRadius: 100,
                  iconCreateFunction: function(cluster) {
                    return new L.DivIcon({ html: '<span class="badge badge-info">' +
                        cluster.getChildCount() + '<i class="icon-comment"></i></span>' });
                  }
                });
                this.mapCanvas.addLayer(self.annotationLayer);
        }, this);
    },
    createAnnotationsLayer: function () {
        var self = this;
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
        var self = this;
        this.annotationLayer.clearLayers();

        for (var i=0; i<annotations.length; i++) {
            var a = annotations[i];
            if (a.location) {
                try {
                    var marker = L.marker(a.location, {
                        clickable: true,
                        url: a.url
                    });
                    marker.on('click', self.showPopup, self);
                    this.annotationLayer.addLayer(marker);
                }
                catch (ex) {
                    console.error('Failed to add an annotation marker: ' + ex);
                }
            }
        }
    },
    showPopup: function (e) {
        var self = this;
        var marker = e.target;
        var url = marker.valueOf().options.url;

        marker.unbindPopup();

        var model = new Lizard.Models.Annotation({url: url});
        model.fetch()
        .done(function (model) {
            var html = self.annotation2html(model);
            var popup = L.popup({
                autoPan: false,
                zoomAnimation: false
            });
            marker.bindPopup(html, popup);
            marker.openPopup();
        });
    },
    buildQueryUrlParams: function () {
        var bbox = this.mapCanvas ? this.mapCanvas.getBounds().toBBoxString() : null;
        return {
            category: 'ddsc',
            bbox: bbox
        };
    },
    updateAnnotations: function (e) {
        var self = this;
        // dont retrieve annotations, when updating has been 'paused',
        // for example, during autopan
        if (!self.enableUpdateAnnotations) {
            return;
        }

        var url = settings.annotations_search_url;
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
                annotationsCount: data.count,
                annotations: data.results.length !== 0 ? data.results : null
            });
            // hack: update the toggler as well
            $('.annotation .badge').text(data.count);
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

            if (self.model.get('annotations') !== null) {
                var annotationCollection = new Lizard.Collections.Annotation();
                var annotations = _.each(self.model.get('annotations'), function(annotation){
                    var model = new Backbone.Model(annotation);
                    annotationCollection.add(model);
                });
                var annotationCollectionView = new Lizard.Views.AnnotationBoxCollectionView({
                    collection: annotationCollection
                });
                self.$el.find('#annotation-overview').append(annotationCollectionView.render().el);
            }
        });
    },
    setIsLoading: function (isLoading) {
        this.model.set({
            'isLoading': isLoading
        });
    },
    modelEvents: {
        'change:isLoading': function (){
        }
    },
    onBeforeClose: function () {
        // returning false prevents the view from being closed
        return true;
    },
    onClose: function () {
        // custom cleanup or closing code, here
        this.mapCanvas.off('moveend', this.updateAnnotations, this);
        this.mapCanvas.off("popupopen", this.popupOpen, this);
        this.mapCanvas.off("popupclose", this.popupClose, this);
        Lizard.App.vent.off("makeAnnotation", Lizard.Views.CreateAnnotationView);
    },
    templateHelpers: {
        showMessage: function (){
            return '...';
        }
    },
    annotation2html: function (annoModel) {
        if (annoModel.get('username') === account.get('user').username){
            annoModel.set({rwpermission: true});
        } else {
            annoModel.set({rwpermission: false});
        }
        var annotationPopup = new Lizard.Views.AnnotationPopupView({model: annoModel});
        var html = annotationPopup.render().el;
        return html;
    }
});


// Fixes the z-index of the datepicker which appeared behind the modal
$('.datepick-annotate').live('focus', function(e) {
    $('#ui-datepicker-div').css('z-index', 10000);
});


Lizard.Views.AnnotationPopupView = Backbone.Marionette.ItemView.extend({
    template: '#annotation-popup',
    initialize: function(options) {
        this.model = options.model;
    },
    events: {
        'click .annotation-delete' : 'destroyAnnotation',
        'click .annotation-edit' : 'editAnnotation'
    },
    destroyAnnotation: function(){
        var self = this;
        this.model.destroy()
        .done(function(){
            Lizard.App.vent.trigger("changedestroyAnnotation", self);
        });
    },
    editAnnotation: function(){
        Lizard.App.vent.trigger("makeAnnotation", this.model);
    }
});



Lizard.Views.AnnotationBoxItem = Backbone.Marionette.ItemView.extend({
    related_object: null,
    tagName: 'li',
    className: 'annotation-open',
    events:{
        'click': 'openAnnotation'
    },
    collectionEvents: {
        'change reset remove add' : 'render'
    },
    openAnnotation: function(){
            Lizard.App.vent.trigger("makeAnnotation", this.model);
    },
    template: function(model){
        return _.template(
            '<span > <%= annotation.text %></span>', {text: model.text}, {variable: 'annotation'});
    }
});

Lizard.Views.AnnotationBoxCollectionView = Backbone.Marionette.CollectionView.extend({
    collection: null,
    tagName: 'ol',
    initialize: function(options){
        this.collection = new Backbone.Collection(options.collection.first(10));
    },
    itemView: Lizard.Views.AnnotationBoxItem
});
