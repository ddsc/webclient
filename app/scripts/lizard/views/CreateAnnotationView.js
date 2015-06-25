// Note: this "View" isn't actually a Backbone / Marionette View for some reason
Lizard.Views.CreateAnnotationView = function(relation){
    var annotationLayout = new Lizard.Views.AnnotationLayout();
    // show in app.
    var related_object = null;
    var marker = null;
    Lizard.App.hidden.show(annotationLayout);
    annotationLayout.render();
    annotationLayout.body.show(new Lizard.Views.AnnotationCollectionView({relation: relation}));
    if (relation._leaflet_id){
        marker = relation;
    }
    else if (/(.*)timeseries(.*)/.test(relation.get('url'))) {
        related_object = {
            'primary': relation.get('pk').toString(),
            'model' : 'Timeseries',
        };

    } else if (relation.get('geometry')){
        related_object = {
            'primary': relation.get('pk').toString(),
            'model' : 'location'
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
          data.location = '{"type":"Point","coordinates":['
            + marker._latlng.lng.toString()
            + ','
            + marker._latlng.lat.toString()
            + ']}';
      }
      if (related_object){
        data.object_type = related_object.model;
        data.object_id = related_object.primary;
      }

      var success = function(data){
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
        Lizard.App.vent.trigger('changedestroyAnnotation');
      };

      var error = function(){
        if (marker){
            window.drawnItems.removeLayer(marker);
        }
        $('#annotation-modal').modal('toggle');
        Lizard.App.hidden.close();
        $('.top-right').notify({message:{
          text: 'Daar ging iets mis, de annotatie is niet opgeslagen!'
              }, type: 'danger'
          }).show();
      };

      // The above is legacy jquery stuff. From here in it is all HTML5 FormData
      // object. It puts the data from above on the the object and includes an
      // optional attachment.
      var formData = new FormData();

      $.each(data, function (k, v) { formData.append(k, v); });

      var file = $('form.annotation input[name="attachment"]')[0].files[0];
      if (file) {
        formData.append('attachment', file);
      }

      var xhr = new XMLHttpRequest();

      xhr.addEventListener("load", success, false);
      xhr.addEventListener("error", error, false);

      xhr.open('POST', settings.annotations_url, true);

      xhr.send(formData);

    });
};

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
        if (this.model.get('location')){
          var location = this.model.get('location');
          data.location = '{"type": "Point", "coordinates": ['
            + location.coordinates[0]
            + ', '
            + location.coordinates[1]
            + ']}';
        }
        this.model.save(data, {
            success: function(model, response, that){
                $('.top-right').notify({
                message:{text: 'Annotatie gewijzigd'},
                type: 'success'}).show();

                patchAttachment(response.id);

                $('#annotation-modal').modal('toggle');
                Lizard.App.hidden.close();
                Lizard.App.vent.trigger('changedestroyAnnotation');
            },
            error: function(){
                $('.top-right').notify({
                message:{text: 'Annotatie wijzigen mislukt'},
                type: 'warning'}).show();
                this.$el.find('.collapse').toggleClass('in');
            }
        });

        this.$el.find('.collapse').toggleClass('in');

        var patchAttachment = function (id) {
          var file = $('form.annotation input[name="attachment"]')[0].files[0];

          if (!file) { return; }

          var success = function(data){
            $('.top-right').notify({
              message:{text: 'Annotatie bijlage gewijzigd'},
              type: 'success'}).show();
            // Close and unbind the popup when clicking the "Save" button.
            // Need to use Leaflet internals because the public API doesn't offer this.
            if (marker){
                window.drawnItems.removeLayer(marker);
            }
            $('#annotation-modal').modal('toggle');
            Lizard.App.hidden.close();
            Lizard.App.vent.trigger('changedestroyAnnotation');
          };

          var error = function(){
            if (marker){
                window.drawnItems.removeLayer(marker);
            }
            $('#annotation-modal').modal('toggle');
            Lizard.App.hidden.close();
            $('.top-right').notify({message:{
              text: 'Daar ging iets mis, de annotatie is niet opgeslagen!'
                  }, type: 'danger'
              }).show();
          };

          // The above is legacy jquery stuff. From here in it is all HTML5 FormData
          // object.
          var formData = new FormData();

          formData.append(
            'attachment',
            $('form.annotation input[name="attachment"]')[0].files[0]
          );

          var xhr = new XMLHttpRequest();

          xhr.addEventListener("load", success, false);
          xhr.addEventListener("error", error, false);

          xhr.open('PATCH', settings.annotations_url + id + '/', true);

          xhr.send(formData);

        };

    },
    'delete': function(){
        this.model.destroy().done(function(){
          $('#annotation-modal').modal('toggle');
          Lizard.App.hidden.close();
          Lizard.App.vent.trigger('changedestroyAnnotation');
        });
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
    onShow: function(){
        if (this.collection.length != 0 ){
            this.$el.find('.edit-header').removeClass('hide');
        }
    },
    buildQueryUrlParams: function () {
        var params = {};
        if (this.relation._leaflet_id) {
            // random leaflet marker
            $.extend(params, {
                point: this.relation.getLatLng().lat.toString()
                    + ','
                    + this.relation.getLatLng().lng.toString()
            });
        }
        else {
            // backbone model
            if (/(.*)timeseries(.*)/.test(this.relation.url)) {
                // timeseries
                $.extend(params, {
                    object_id: this.relation.get('pk').toString(),
                    object_type__model: 'timeseries'
                });
            }
            else if (/(.*)locations(.*)/.test(this.relation.url)) {
                // locations
                $.extend(params, {
                    // point: point
                    object_id: this.relation.get('pk').toString(),
                    object_type__model: 'location'
                });
            }
            else if (this.relation.has('location')) {
              // annotation

              var coords = this.relation.get('location').coordinates;
              params.point = coords[0].toString()
                + ','
                + coords[1].toString();
            }
        }

        return params;
    },
    initialize: function(options) {
        this.relation = options.relation;
        this.collection = new Lizard.Collections.Annotation();
        if (this.relation !== null) {
            this.collection.fetch({
                url: settings.annotations_url + '?' + $.param(this.buildQueryUrlParams())
            });
        }
    }
});
