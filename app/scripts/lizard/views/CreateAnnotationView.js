// Note: this "View" isn't actually a Backbone / Marionette View for some reason
Lizard.Views.CreateAnnotationView = function(relation){
    console.log('new annotation');
    var annotationLayout = new Lizard.Views.AnnotationLayout();
    // show in app.
    var related_object = null;
    var marker = null;
    Lizard.App.hidden.show(annotationLayout);
    annotationLayout.render();
    annotationLayout.body.show(new Lizard.Views.AnnotationCollectionView({relation: relation}));
    if (relation._leaflet_id){
        marker = relation;
    } else if (relation.get('events')){
        related_object = {
            'primary': relation.get('pk').toString(),
            'model' : 'timeseries'
        };
    } else if (relation.get('point_geometry')){
        related_object = {
            'primary': relation.get('pk').toString(),
            'model' : 'location',
            'location': relation.get('point_geometry')
        };
    }
    // // initiate datepickers on the div's

    $('#ui-datepicker-div').css('z-index', 10000);
    $('#annotation-modal .datepick-annotate').datetimepicker({
      format: "yyyy-mm-ddThh:mm",
      timezone: "WET",
      onRender: function ()
       {
          var date = new Date();
          return date;
       }
    }).on('changeDate', function(ev){
      $('#annotation-modal .datepick-annotate').datetimepicker('hide');
    });

    $('#annotation-modal').modal();

    // If annotation is not filled out but closed.
    // View should be removed and marker removed from marker
    $('#annotation-modal').on('hide', function(){
        Lizard.App.hidden.close();
        if (marker){
            window.drawnItems.removeLayer(marker);
        }
    });

    // initialize file upload form
    $('form.annotation input[name="attachment"]').fileupload({
        dataType: 'json',
        url: settings.annotations_files_upload_url, // Note: this endpoint needs to return text/plain for IE9!
        done: function (e, data) {
            if (data.result.success === true) {
                var $a = $('<a>')
                .attr({
                    href: data.result.url,
                    target: '_blank'
                })
                .text('Bekijk ' + data.result.filename);
                var $form = $(this).parents('form').first();
                $form.find('.uploaded-file').empty().append($a);
                $form.find('input[name="attachment_pk"]').val(data.result.attachment_pk);
                $form.find('input[name="picture_url"]').val(data.result.url);
            }
            else {
                $('.top-right').notify({type: 'warning', message: {text: 'Fout bij het uploaden: ' + JSON.stringify(data.result.errors)}}).show();
            }
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
      if (marker){
          data.location = marker._latlng.lat.toString() + ',' + marker._latlng.lng.toString();
      }
      if (related_object){
        data.the_model_name = related_object.model;
        data.the_model_pk = related_object.primary;
        if (related_object.location) {
            data.location = related_object.location;
        }
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
          if (marker){
              window.drawnItems.removeLayer(marker);
          }
          $('#annotation-modal').modal('toggle');
          Lizard.App.hidden.close();
          Lizard.App.vent.trigger('updateAnnotationsMap');
        },
        error: function(){
          if (marker){
              window.drawnItems.removeLayer(marker);
          }
          $('#annotation-modal').modal('toggle');
          Lizard.App.hidden.close();
          $('.top-right').notify({message:{
            text: 'Daar ging iets mis, de annotatie is niet opgeslagen!'
                }, type: 'danger'
            }).show();
        }
      });
    });
}

Lizard.Views.AnnotationLayout = Backbone.Marionette.Layout.extend({
    template: '#annotation-template',
    regions: {
        body: '#annotations-list',
        footer: '#annotation-modal-footer'
    }
});


Lizard.Views.Annotations = Backbone.Marionette.ItemView.extend({
    related_object: null,
    className: 'annotation-item',
    template: function(model){
        return _.template(
            $('#annotation-one-template').html(), model, {variable: 'annotation'});
    },
    initialize: function(options){
        this.relation = options.relation;
        if (this.model.get('username') === account.get('user').username){
            this.model.set({rwpermission: true});
        } else {
            this.model.set({rwpermission: false});
        }
    },
    onShow: function(){
      this.$el.find('.datepick-annotate').datetimepicker({
      format: "yyyy-mm-ddTHH:mm",
      timezone: 'WET'
    }).on('changeDate', function(ev){
      $('#annotation-modal .datepick-annotate').datetimepicker('hide');
      });
      if (this.model.get('location')){
        $('#annotation-modal-footer').html("")
      }
    },
    events: {
        'click .annotation-edit' : 'edit',
        'click .annotation-delete' : 'delete',
        'submit form' : 'submitChange'
    },
    edit: function(){
        this.$el.find('.collapse').toggleClass('in');
        // override of the submit function

        // initialize file upload form
        $('form.annotation input[name="attachment"]').fileupload({
            dataType: 'json',
            url: settings.annotations_files_upload_url, // Note: this endpoint needs to return text/plain for IE9!
            done: function (e, data) {
                if (data.result.success === true) {
                    var $a = $('<a>')
                    .attr({
                        href: data.result.url,
                        target: '_blank'
                    })
                    .text('Bekijk ' + data.result.filename);
                    var $form = $(this).parents('form').first();
                    $form.find('.uploaded-file').empty().append($a);
                    $form.find('input[name="attachment_pk"]').val(data.result.attachment_pk);
                    $form.find('input[name="picture_url"]').val(data.result.url);
                }
                else {
                    $('.top-right').notify({type: 'warning', message: {text: 'Fout bij het uploaden: ' + JSON.stringify(data.result.errors)}}).show();
                }
            }
        });
    },
    submitChange: function(e){
        e.preventDefault();
        var data = $(e.currentTarget).serializeObject();
        if (data.datetime_from){
        data.datetime_from = new Date(data.datetime_from).toISOString();
        }
        if (data.datetime_until){
        data.datetime_until = new Date(data.datetime_until).toISOString();
        }
        this.model.set(data);
        if (this.model.get('location')){
          var location = this.model.get('location')
          this.model.set({
            location: [parseFloat(location[0]), parseFloat(location[1])]
          })
        }
        this.model.save({
            success: function(model, response, that){
                $('.top-right').notify({
                message:{text: 'Annotatie gewijzigd'},
                type: 'success'}).show();
            },
            error: function(){
                $('.top-right').notify({
                message:{text: 'Annotatie wijzigen mislukt'},
                type: 'warning'}).show();
                this.$el.find('.collapse').toggleClass('in');
            }
        });
        this.$el.find('.collapse').toggleClass('in');
        $('#annotation-modal').modal('toggle');
        Lizard.App.hidden.close();
        Lizard.App.vent.trigger('updateAnnotationsMap');
    },
    'delete': function(){
        this.model.destroy();
          $('#annotation-modal').modal('toggle');
          Lizard.App.hidden.close();
          Lizard.App.vent.trigger('updateAnnotationsMap');

    }
});

Lizard.Views.AnnotationCollectionView = Backbone.Marionette.CollectionView.extend({
    collection: null,
    itemView: Lizard.Views.Annotations,
    className: 'annotation-items',
    relation: null,
    itemViewOptions: function () {
        return {
            relation: this.relation
        };
    },
    buildQueryUrlParams: function () {
        var params = {
            category: 'ddsc'
        };
        if (this.relation._leaflet_id) {
            // random leaflet marker
            $.extend(params, {
                north: this.relation.getLatLng().lat,
                south: this.relation.getLatLng().lat,
                west: this.relation.getLatLng().lng,
                east: this.relation.getLatLng().lng
            });
        }
        else {
            // backbone model
            if (/(.*)timeseries(.*)/.test(this.relation.url)) {
                // timeseries
                $.extend(params, {
                    model_pk: this.relation.get('pk').toString(),
                    model_name: 'timeseries'
                });
            }
            else if (/(.*)locations(.*)/.test(this.relation.url)) {
                // locations
                $.extend(params, {
                    model_pk: this.relation.get('pk').toString(),
                    model_name: 'location'
                });
            }
            else if (this.relation.has('location')) {
                // annotation
                var location = this.relation.get('location');
                if (location.length === 2) {
                    $.extend(params, {
                        north: location[0],
                        south: location[0],
                        west: location[1],
                        east: location[1]
                    });
                }
            }
        }

        return params;
    },
    initialize: function(options) {
        this.relation = options.relation;
        this.collection = new Lizard.Collections.Annotation();
        if (this.relation !== null) {
            this.collection.fetch({
                url: settings.annotations_search_url + '?' + $.param(this.buildQueryUrlParams())
            });
        }
    }
});
