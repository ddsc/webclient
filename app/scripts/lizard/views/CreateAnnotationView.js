Lizard.Views.CreateAnnotationView = function(relation){
    console.log('new annotation');
    var annotationLayout = new Lizard.Views.AnnotationLayout();
    // show in app.
    var related_object = null;
    Lizard.App.hidden.show(annotationLayout);
    annotationLayout.render();
    annotationLayout.body.show(new Lizard.Views.AnnotationCollectionView({relation: relation}));
    if (relation._leaflet_id){
        var layer = relation;
    } else if (relation.get('events')){
        related_object = {
            'primary': relation.get('pk').toString(),
            'model' : 'timeseries'
        };
    } else if (relation.get('point_geometry')){
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
    // View should be removed and marker removed from layer
    $('#annotation-modal').on('hide', function(){
        Lizard.App.hidden.close();
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
          Lizard.App.hidden.close();
          Lizard.App.vent.trigger('updateAnnotationsMap');
        },
        error: function(){
          if (layer){
              window.drawnItems.removeLayer(layer);
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
        body: '#annotations-list'
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
        var relation = options.relation;
    },
    onShow: function(){
      this.$el.find('.datepick-annotate').datetimepicker({
      format: "yyyy-mm-ddTHH:mm",
      timezone: 'WET'
    }).on('changeDate', function(ev){
      $('#annotation-modal .datepick-annotate').datetimepicker('hide');
    });
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
    },
    'delete': function(){
        this.model.destroy();
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
        if (/(.*)annotation(.*)/.test(this.relation.url)) {
            $.extend(params, {
                location: this.relation.get('location')
            });
        }
        else if (/(.*)timeseries(.*)/.test(this.relation.url)) {
            // timeseries
            $.extend(params, {
                model_pk: this.relation.get('pk').toString(),
                model_name: 'timeseries'
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
