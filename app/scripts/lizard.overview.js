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
  template: '#dashboard-template',
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
                console.log('Syncing dashboard: ', gridster.serialize());
                $('.top-right').notify({
                    message: {
                      text: 'Saving your dashboard layout!'
                    }
                  }).show();
              }
            }
        }).data('gridster');

        gridster.add_widget(
          '<li class="new">' +
          '<div id="g1"></div>' +
          '</li>',
          2,
          2,
          1,
          1
        );

        gridster.add_widget(
          '<li class="new">' +
          '<div id="g2"></div>' +
          '</li>',
          2,
          2,
          1,
          3
        );

        gridster.add_widget(
          '<li class="new">' +
          '<div id="g3"></div>' +
          '</li>',
          2,
          2,
          3,
          1
        );


        var g1 = new JustGage({
          id: "g1", 
          value: getRandomInt(650, 980), 
          min: 350,
          max: 980,
          title: "Amstel",
          label: "Verplaatsing (m3/s)"
        });

        var g2 = new JustGage({
          id: "g2", 
          value: 70, 
          min: 0,
          max: 100,
          title: "Amstel 4-2-21",
          label: "Waterstand (NAP)"
        });
        
        var g3 = new JustGage({
          id: "g3", 
          value: 80, 
          min: 0,
          max: 100,
          title: "Amstel 4-2-20",
          label: "Waterstand (NAP)"
        });

        setInterval(function() {
          g1.refresh(getRandomInt(350, 980));
          g2.refresh(getRandomInt(80, 90));          
          g3.refresh(getRandomInt(80, 90));          
        }, 2500);        

  }
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









