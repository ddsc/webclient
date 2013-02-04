// Prevent console.log from throwing errors
if(typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}


// Click handlers for toggling the filter/location/parameter UI
$('li#filters a em').live("click", function(e){
  e.preventDefault();
  var el = $(this).parent().next();
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});
$('li#locations a em').live("click", function(e){
  e.preventDefault();
  var el = $(this).parent().next();
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});
$('li#parameters a em').live("click", function(e){
  e.preventDefault();
  var el = $(this).parent().next();
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});



var ModalView = Backbone.Marionette.ItemView.extend({
    template: '#location-modal-header-template',
    model: null,
    initialize: function(model){
        this.model = model;
    }
})

Lizard.ModalLayout = Backbone.Marionette.Layout.extend({
  template: '#location-modal-template',
  regions: {
    'header': '#location-modal-header',
    'body': '#location-modal-body',
  }
});

var modalLayout = new Lizard.ModalLayout();
var modalView = null;

Lizard.Utils = {};
Lizard.Utils.Map = {
    modalInfo: function (e){
          var marker = e.target;
          console.log(marker);
          modalLayout.header.show(modalView.render());
          var model = marker.valueOf().options.bbModel;
          $('#location-modal').modal();
    },
    updateModal: function(e){
        var marker = e.target;
        
    },
    updateInfo: function (e) {
        var marker = e.target;
        console.log(e);
        props = marker.valueOf().options;
        e.layer._map._controlContainer.innerHTML = '<h4>Datapunt</h4>' + (props ?
                '<b>' + props.name + '</b><br>' +
                'Punt: ' + props.code
                : 'Zweef over de punten');
    },
    // drawonMap takes the collection and goes through the models in it
    // 'drawing' them on the map.
    drawonMap: function(collection, objects){
        var models = collection.models;
        for (var i in models){
          var model = models[i];
          model.fetch({async: false});
          var attributes = model.attributes;
          var point = attributes.point_geometry;
          var marker = new L.Marker(new L.LatLng(point[1], point[0]),{
            clickable: true,
            name: attributes.name,
            bbModel: model,
            code: attributes.code
          });
          //marker.on('mouseover', this.updateInfo);
          marker.on('click', this.modalInfo);
          this.markers.addLayer(marker);
    }},
    selectforCollage: function(e) {
        var marker = e.target;
        var properties = marker.valueOf().options;
        var wsitem = properties.bbModel;
        wsitem.set({title: wsitem.attributes.name})
        Collage.add(wsitem);
    }
};

