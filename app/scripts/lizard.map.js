Lizard.Map = {};

Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  regions: {
    'iconsView': '#iconsView',
    'mapView': '#mapView'
  }
});

Lizard.Map.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'map': 'map'
    }
});

Lizard.Map.map = function(){
  console.log('Lizard.Map.map()');
  var mapView = new Lizard.Map.DefaultLayout();



  Lizard.content.show(mapView);


  var bounds = new L.LatLngBounds(
    new L.LatLng(53.74, 3.2849),
    new L.LatLng(50.9584, 7.5147)
  );

  var cloudmade = L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'
  });

  var map = L.map('map', {
    layers: [cloudmade],
    center: new L.LatLng(52.12, 5.2),
    zoom: 7,
    maxBounds: bounds
  });


  Backbone.history.navigate('map');
};



Lizard.addInitializer(function(){
  Lizard.Map.router = new Lizard.Map.Router({
    controller: Lizard.Map
  });
  Lizard.vent.trigger('routing:started');
});

