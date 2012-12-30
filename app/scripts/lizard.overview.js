Lizard.Overview = {};


Lizard.Overview.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#overview-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'dashboardRegion': '#dashboardRegion'
  }
});

Lizard.Overview.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'overview': 'overview'
    }
});




Lizard.Overview.DashboardView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('DashboardView.initialize()');
  },
  onDomRefresh: function() {
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    console.log('onDomRefresh()');
    
     
        var gridster = $('.gridster ul').gridster({
            widget_margins: [10, 10],
            widget_base_dimensions: [140, 140],
            draggable: {
              stop: function(event, ui) {
                console.log('Syncing: ', gridster.serialize());
                $('.top-right').notify({
                    message: {
                      text: 'Synchronizing your dashboard layout!'
                    }
                  }).show();
              }
            }
        }).data('gridster');

        gridster.add_widget(
          '<li class="new">' +
          '<div id="gauge-preview">' +
          '<div id="preview-textfield" style="color:#000;font-size:1.1em;padding:20px;"><strong>Waternet</strong></div>' +
          '<canvas id="canvas-preview1"></canvas>' +
          '<div id="preview-textfield" style="color:#ccc;font-size:.9em;padding:20px;">Amstel, sectie 2.4.2, Waterstand</div>' +
          '</div></li>',
          2,
          2,
          1,
          1
        );

        gridster.add_widget(
          '<li class="new">' +
          '<div id="gauge-preview">' +
          '<div id="preview-textfield" style="color:#000;font-size:1.1em;padding:20px;"><strong>Waternet</strong></div>' +
          '<canvas id="canvas-preview2"></canvas>' +
          '<div id="preview-textfield" style="color:#ccc;font-size:.9em;padding:20px;">Amstel, sectie 2.4.2, Verplaatsing</div>' +
          '</div></li>',
          2,
          2,
          1,
          3
        );


        var opts1 = {
          lines: 13, // The number of lines to draw
          angle: 0.05, // The length of each line
          lineWidth: 0.44, // The line thickness
          pointer: {
            length: 0.9, // The radius of the inner circle
            strokeWidth: 0.053, // The rotation offset
            color: '#000000' // Fill color
          },
          colorStart: '#6FADCF',   // Colors
          colorStop: '#8FC0DA',    // just experiment with them
          strokeColor: '#E0E0E0',   // to see which ones work best for you
          generateGradient: true
        };
        var target1 = document.getElementById('canvas-preview1'); // your canvas element
        var gauge1 = new Gauge(target1).setOptions(opts1); // create sexy gauge!
        gauge1.maxValue = 3000; // set max gauge value
        gauge1.animationSpeed = 32; // set animation speed (32 is default value)
        gauge1.set(1250); // set actual value




        var opts2 = {
          lines: 13, // The number of lines to draw
          angle: 0.05, // The length of each line
          lineWidth: 0.44, // The line thickness
          pointer: {
            length: 0.9, // The radius of the inner circle
            strokeWidth: 0.053, // The rotation offset
            color: '#000000' // Fill color
          },
          colorStart: '#6FADCF',   // Colors
          colorStop: '#8FC0DA',    // just experiment with them
          strokeColor: '#E0E0E0',   // to see which ones work best for you
          generateGradient: true
        };
        var target2 = document.getElementById('canvas-preview2'); // your canvas element
        var gauge2 = new Gauge(target2).setOptions(opts2); // create sexy gauge!
        gauge2.maxValue = 3000; // set max gauge value
        gauge2.animationSpeed = 32; // set animation speed (32 is default value)
        gauge2.set(679); // set actual value

  },
  template: '#dashboard-template'
});



Lizard.Overview.overview = function(){
  console.log('Lizard.Overview.overview()');

  // Instantiate Overview's default layout
  var overviewView = new Lizard.Overview.DefaultLayout();
  Lizard.content.show(overviewView);
  

  var dashboardView = new Lizard.Overview.DashboardView();
  
  overviewView.dashboardRegion.show(dashboardView.render());
  Backbone.history.navigate('overview');
};

Lizard.addInitializer(function(){
  Lizard.Overview.router = new Lizard.Overview.Router({
    controller: Lizard.Overview
  });
  
  Lizard.vent.trigger('routing:started');
});









