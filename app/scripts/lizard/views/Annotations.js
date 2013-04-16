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
        Lizard.App.vent.on("makeAnnotation", this.newAnnotation);
        Lizard.App.vent.on("savedpopup", this.updateAnnotations, this);
    },
    events: {
    },
    triggers: {
        //"click .do-something": "something:do:it"
    },
    newAnnotation: function(relation){
    	var annotationCollectionView = new Lizard.Views.AnnotationsCollectionView(relation);
        $('body').append(annotationCollectionView.render());
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


// Fixes the z-index of the datepicker which appeared behind the modal
$('.datepick-annotate').live('focus', function(e) {
    $('#ui-datepicker-div').css('z-index', 10000);
});

Lizard.Views.AnnotationCollectionView = Backbone.Marionette.CollectionView.extend({
	itemView: Lizard.Views.Annotations,
	itemViewOptions: {
		relation: null
	}
	tagName: ul,
	initialize: function (relation) {
		this.itemViewOptions.relation = relation;
		
	}
});

Lizard.Views.Annotations = Backbone.Marionette.ItemView.extend({
	template: _.template(
            $('#leaflet-annotation-template').html(), {
			      text: "Kaboo-yah",
			      visibility: "public"
			    }, {variable: 'annotation'}),
	initialize: function(options){
		var relation = options.relation;
		// Check what kind of object is making this annotation
        // In the case of a non related location, very simple
        // if either timeseries or location check if there are 
        // notations on this already
        
        if (relation._leaflet_id){
            var layer = relation;
        } else if (relation.get('events')){
            var related_object = {
                'primary': relation.get('pk').toString(),
                'model' : 'timeseries'
            };
        } else if (relation.get('point_geometry')){
            var related_object = {
                'primary': relation.get('pk').toString(),
                'model' : 'location'
            };
        };
        
        if (related_object){
        	var annotation = $.ajax({
	            url: settings.annotations_search_url,
	            data: 'model_name=' + related_object.model + '&model_pk=' + related_object.primary,
	            dataType: 'json'
        	}).done(function (data, textStatus, jqXHR) {
	            if (data.results) {
	                console.log(data.results);
	            }
        	});
        }
        // add leaflet annotation to body. This is a modal
        // so body is fine
        (_.template(
            $('#leaflet-annotation-template').html(), {
			      text: "Kaboo-yah",
			      visibility: "public"
			    }, {variable: 'annotation'})
            );

       // open modal view
        $('#annotation-modal').modal();

        // // initiate datepickers on the div's

        $('#ui-datepicker-div').css('z-index', 10000);
        $('#annotation-modal .datepick-annotate').datepicker({
          format: "yyyy-mm-dd",
          onRender: function ()
           {
              var date = new Date();
              return date;
           }
        }).on('changeDate', function(ev){
          $('#annotation-modal .datepick-annotate').datepicker('hide');
        });

        // If annotation is not filled out but closed.
        // View should be removed and marker removed from layer
        $('#annotation-modal').on('hide', function(){
            $(this).remove();
            if (layer){
                window.drawnItems.removeLayer(layer);
            }
        });

        // override of the submit function
        $('form.annotation').submit(function(e) {
          e.preventDefault();
          var data = $(this).serializeObject();
          if (data.datetime_from){
            data.datetime_from = new Date(data.datetime_from).toISOString();
          }
          if (data.datetime_until){
            data.datetime_until = new Date(data.datetime_until).toISOString();
          }
          if (layer){
              data.location = layer._latlng.lat.toString() + ',' + layer._latlng.lng.toString();
          }
          if (related_object){
            data.the_model_name = related_object.model;
            data.the_model_pk = related_object.primary;
          }
          data.category = 'ddsc';
          $.ajax({
            type: "POST",
            url: settings.annotations_create_url,
            data: $.param(data),
            success: function(data){
              $('.top-right').notify({
                message:{text: 'Annotatie geplaatst'},
                type: 'success'}).show();
            // Close and unbind the popup when clicking the "Save" button.
            // Need to use Leaflet internals because the public API doesn't offer this.
              if (layer){
                  window.drawnItems.removeLayer(layer);
              }
              $('#annotation-modal').modal('toggle');
              $('#annotation-modal').remove();
              Lizard.App.vent.trigger('savedpopup');
            },
            error: function(){
              if (layer){
                  window.drawnItems.removeLayer(layer);
              }
              $('#annotation-modal').modal('toggle');
              $('#annotation-modal').remove();
              $('.top-right').notify({message:{
                text: 'Daar ging iets mis, de annotatie is niet opgeslagen!'
                    }, type: 'danger'
                }).show();
            }
          });
        });

	}
});
