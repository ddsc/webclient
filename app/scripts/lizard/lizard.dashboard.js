Lizard.Dashboard = {};


Lizard.Dashboard.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#dashboard-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'dashboardRegion': '#dashboardRegion'
  }
});

Lizard.Dashboard.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'dashboard': 'dashboard'
    }
});



Lizard.Dashboard.dashboard = function() {
  console.log('Lizard.Dashboard.overview()');

  // Instantiate Dashboard's default layout
  var dashboardView = new Lizard.Dashboard.DefaultLayout();
  Lizard.App.content.show(dashboardView);

  var widgetcollectionview = new Lizard.Views.WidgetCollection();

  var timeseries = [
    "https://api.ddsc.nl/api/v1/timeseries/9DFDC3F7-88F7-4FF0-A671-B4094AC12B7A",  // Waterkolom dijk rechts in mNAP
    "https://api.ddsc.nl/api/v1/timeseries/49108710-6C58-4E31-AC2D-3C4933040439",  // Waterkolom dijk links in mNAP
    "https://api.ddsc.nl/api/v1/timeseries/03073703-3509-40F2-BA89-D85361C4021B",  // Temperatuur Dijk Rechts
    "https://api.ddsc.nl/api/v1/timeseries/29119285-2428-4863-B630-9B5AA095DE13",  // Temperatuur Dijk Links
    // "https://api.ddsc.nl/api/v1/timeseries/DD7A4DB5-4261-4AC4-9583-0572E7F39F66",  // Actueel Debiet Dijk Rechts
    // "https://api.ddsc.nl/api/v1/timeseries/D856946F-FEB6-4536-A878-AF55C32CD96C",  // Actueel Debiet Dijk Links
    "https://api.ddsc.nl/api/v1/timeseries/5C8D7780-14C8-4237-9BCA-73849E7990B7"   // Buitendruk in kPa
  ];

  var dmcCollection = Backbone.Collection.extend({
    url: "https://api.ddsc.nl/api/v1/timeseries/?name=omzd_dmc",
    model: Lizard.Models.Timeserie
  });



  dmc = new dmcCollection();
  
  if (account.get('authenticated')) {
    dmc.fetch({
      cache: false,
      success: function(collection) {
        var values = new Backbone.Model({
          debiet_l: collection.get('D856946F-FEB6-4536-A878-AF55C32CD96C').get('latest_value'),
          debiet_r: collection.get('DD7A4DB5-4261-4AC4-9583-0572E7F39F66').get('latest_value'),
          temp_l: collection.get('29119285-2428-4863-B630-9B5AA095DE13').get('latest_value'),
          temp_r: collection.get('03073703-3509-40F2-BA89-D85361C4021B').get('latest_value'),
          waterst_l: collection.get('49108710-6C58-4E31-AC2D-3C4933040439').get('latest_value'),
          waterst_r: collection.get('9DFDC3F7-88F7-4FF0-A671-B4094AC12B7A').get('latest_value')
        });

        widgetcollectionview.collection.reset();
        widgetcollectionview.collection.add([
          new Lizard.Models.Widget({col:1,row:1,size_x:2,size_y:4,gaugeId:4,type:'template', template:'#dashboard-list'}),
          new Lizard.Models.Widget({col:3,row:1,size_x:7,size_y:4,gaugeId:3,type:'graph', timeseries: timeseries}),
          new Lizard.Models.Widget({col:10,row:1,size_x:3,size_y:4,gaugeId:4,type:'legend'}),
          new Lizard.Models.Widget(_.extend({col:3,row:5,size_x:7,size_y:3,gaugeId:2,type:'template', template:'#dmc-overview'},values.attributes)),
          new Lizard.Models.Widget({col:10,row:5,size_x:3,size_y:2,gaugeId:4,type:'template', template:'#dashboard-logo'}),
          new Lizard.Models.Widget({col:10,row:7,size_x:3,size_y:1,gaugeId:8,type:'template', template:'#settings-button'}),
          new Lizard.Models.Widget({col:3,row:8,size_x:7,size_y:4,gaugeId:9,type:'template', template:'#image-dmc'}),
          new Lizard.Models.Widget({col:10,row:8,size_x:3,size_y:2,gaugeId:5,title:'Debiet links',label:'liter',
            value: values.get('debiet_l') , max: 5000}),
          new Lizard.Models.Widget({col:10,row:10,size_x:3,size_y:2,gaugeId:7,title:'Debiet rechts',label:'liter',
            value: values.get('debiet_r'), max: 5000})
        ]);
        
        dashboardView.dashboardRegion.show(widgetcollectionview.render());
      }
    });
  }



  Backbone.history.navigate('dashboard');
};

Lizard.App.addInitializer(function(){
  Lizard.Dashboard.router = new Lizard.Dashboard.Router({
    controller: Lizard.Dashboard
  });
});









