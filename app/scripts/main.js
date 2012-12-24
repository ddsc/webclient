// Prevent console.log from throwing errors
if(typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

// Instantiate the Application()
Lizard = new Backbone.Marionette.Application();

// Add regions
Lizard.addRegions({
  content: '#content',
  menu: '#menu'
});

Lizard.MenuView = Backbone.Marionette.View.extend({
  el: '#menu',
  
  events: {
    'click #menu .map-menu': 'mapApp'
  },
  
  mapApp: function(e) {
    console.log('clicked!');
    e.preventDefault();
    Lizard.Map.map();
  }
});

Lizard.vent.on('layout:rendered', function(){
  console.log('layout:rendered');
  var menu = new Lizard.MenuView();
  Lizard.menu.attachView(menu);
});


Lizard.on('initialize:after', function() {
  Backbone.history.start();
});


Lizard.content.on("show", function(view){
  console.log("content show()", view);
});

Lizard.content.on("close", function(view){
  console.log("content close()", view);
});


// Lizard.vent.on('routing:started', function(){
//   if( ! Backbone.History.started) Backbone.history.start();
// });
