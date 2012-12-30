// Prevent console.log from throwing errors
if(typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

// Instantiate the Application()
Lizard = new Backbone.Marionette.Application();

// Add regions for Lizards main interface (menu + content)
Lizard.addRegions({
  content: '#content',
  menu: '#menu'
});

// Start Backbone's url router
Lizard.on('initialize:after', function() {
  Backbone.history.start();
});





// Lizard.content.on('show', function(view){
//   console.log('content.show()', view);
// });

// Lizard.content.on('close', function(view){
//   console.log('content.close()', view);
// });

// Lizard.vent.on('routing:started', function(){
//   if( ! Backbone.History.started) Backbone.history.start();
// });
