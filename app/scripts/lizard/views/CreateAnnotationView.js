Lizard.Views.CreateAnnotationView = function(relation){
    console.log('new annotation');
    var annotationLayout = new Lizard.Views.AnnotationLayout();
    // show in app.
    var related_object = null;
    Lizard.App.hidden.show(annotationLayout);
    annotationLayout.render();
    annotationLayout.body.show(new Lizard.Views.AnnotationCollectionView(relation));
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
          Lizard.App.vent.trigger('savedpopup');
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
        // this.$el.find('#annotation-' + this.model.id.toString()).on('hidden', function (event) {
        //   event.stopPropagation()
        // })
    },
    onShow: function(){
      this.$el.find('.datepick-annotate').datetimepicker({
      format: "yyyy-mm-ddTHH:mm",
      onRender: function ()
       {
          var date = new Date();
          return date;
       }
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
        this.model.urlRoot = settings.annotations_detail_url;
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
        this.render();
    },
    delete: function(){
        this.model.urlRoot = settings.annotations_detail_url;
        this.model.destroy();
    }
});


Lizard.Views.AnnotationCollectionView = Backbone.Marionette.CollectionView.extend({
    collection: null,
  itemView: Lizard.Views.Annotations,
    className: 'annotation-items',
  itemViewOptions: {
    relation: null
  },
  initialize: function (relation) {
    this.itemViewOptions.relation = relation;
        var related_object = null;
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
        this.collection = new Lizard.Collections.Annotation();
        if (related_object !== null) {
            var query = '?model_name=' + related_object.model + '&model_pk=' + related_object.primary;
            this.collection.url = settings.annotations_search_url + query;
            this.collection.fetch();
        }
  }
});