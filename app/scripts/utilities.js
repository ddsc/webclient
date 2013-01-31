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
    booyah: function(that){
        $('#modal').on('show', that.updateModal);
        that.mapCanvas.addLayer(that.markers);
        model = new Lizard.models.Location({"url": "http://test.api.dijkdata.nl/api/v0/locations/e585a2fa-7740-47f2-9060-03cd14edfa33/", "timeseries": ["http://test.api.dijkdata.nl/api/v0/timeseries/88828b39-af28-425b-a29e-d959175bcd77/", "http://test.api.dijkdata.nl/api/v0/timeseries/1e6bcb5c-f0de-458e-8fc1-7b6f0642bbef/", "http://test.api.dijkdata.nl/api/v0/timeseries/fced90cb-9dd2-448b-ab65-0e349e32bb87/", "http://test.api.dijkdata.nl/api/v0/timeseries/4280e5cd-0836-4be9-b9f9-10eac4bd5594/", "http://test.api.dijkdata.nl/api/v0/timeseries/2e89d616-fb19-44f0-aed1-d08ca2c097ce/", "http://test.api.dijkdata.nl/api/v0/timeseries/01076978-98f4-4601-ba9a-f90267253471/", "http://test.api.dijkdata.nl/api/v0/timeseries/2160d7d6-d807-4f35-82c0-3777e794d26f/", "http://test.api.dijkdata.nl/api/v0/timeseries/a61e1822-cd13-46e0-bd48-c1b432714bd8/", "http://test.api.dijkdata.nl/api/v0/timeseries/6c6970ee-bfc1-4590-b487-4c53817f666b/", "http://test.api.dijkdata.nl/api/v0/timeseries/6babac0d-5ce2-47db-ba50-614b06f69f7b/", "http://test.api.dijkdata.nl/api/v0/timeseries/808a59c7-e164-473f-822f-11033c499eaf/", "http://test.api.dijkdata.nl/api/v0/timeseries/1305ea9f-3b9f-4f9b-a3bd-2c7674ef6ea8/", "http://test.api.dijkdata.nl/api/v0/timeseries/4cff3368-14c8-4494-bb05-c3a51a830d82/", "http://test.api.dijkdata.nl/api/v0/timeseries/6f30ee8a-1bcd-4d10-8059-e49a2f18cbb2/", "http://test.api.dijkdata.nl/api/v0/timeseries/cfc477af-c76e-416a-b5f6-e09d6494ff2a/", "http://test.api.dijkdata.nl/api/v0/timeseries/80233868-c010-4e5d-bb17-f64dac55c593/", "http://test.api.dijkdata.nl/api/v0/timeseries/9192e319-b6a7-4667-bb9b-eede835654c7/", "http://test.api.dijkdata.nl/api/v0/timeseries/c5ed9465-fd11-4348-978c-c67210387053/", "http://test.api.dijkdata.nl/api/v0/timeseries/b78e2c23-ef36-4d3b-b79f-30b689d9bcad/", "http://test.api.dijkdata.nl/api/v0/timeseries/55ab3c04-5c00-49fa-96d1-0da636d3b9be/"], "superlocation": null, "sublocations": ["3201_gw1", "3201_gw2", "3201_gw3"], "point_geometry": [5.752314, 52.370159], "uuid": "e585a2fa-7740-47f2-9060-03cd14edfa33", "name": "3201", "description": "Stichtsch Ankeveensche Polder"});
        modalView = new ModalView(model);
        console.log(modalView.render().el);
        var attributes = model.attributes;
        var point = attributes.point_geometry;
        var marker = new L.Marker(new L.LatLng(point[1], point[0]),{
            clickable: true,
            name: attributes.name,
            bbModel: model,
            code: attributes.code
        });
        marker.on('mouseover', this.updateInfo);
        marker.on('click', this.modalInfo);
        that.markers.addLayer(marker);
    },
    modalInfo: function (e){
          var marker = e.target;
          modalLayout.header.show(modalView.render());
          // modalLayout.body.show(modalView.render());
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
        console.log(this);
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

