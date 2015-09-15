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

  // Instantiate Dashboard's default layout
  var dashboardView = new Lizard.Dashboard.DefaultLayout();
  Lizard.App.content.show(dashboardView);

  var widgetcollectionview = new Lizard.Views.WidgetCollection();

  var timeseries = [
    settings.timeseries_url + "9dfdc3f7-88f7-4ff0-a671-b4094ac12b7a",  // Waterkolom dijk rechts in mNAP
    settings.timeseries_url + "49108710-6c58-4e31-ac2d-3c4933040439",  // Waterkolom dijk links in mNAP
    settings.timeseries_url + "03073703-3509-40f2-ba89-d85361c4021b",  // Temperatuur Dijk Rechts
    settings.timeseries_url + "29119285-2428-4863-b630-9b5aa095de13",  // Temperatuur Dijk Links
    // "https://api.ddsc.nl/api/v1/timeseries/dd7a4db5-4261-4ac4-9583-0572e7f39f66",  // Actueel Debiet Dijk Rechts
    // "https://api.ddsc.nl/api/v1/timeseries/d856946f-feb6-4536-a878-af55c32cd96c",  // Actueel Debiet Dijk Links
    settings.timeseries_url + "5c8d7780-14c8-4237-9bca-73849e7990b7"   // Buitendruk in kPa
  ];

  var dmcCollection = Backbone.Collection.extend({
    //url: settings.timeseries_url + "?page_size=20&name__icontains=omzd_dmc",
    url: settings.timeseries_url + "?uuid=d856946f-feb6-4536-a878-af55c32cd96c," +
                                         "dd7a4db5-4261-4ac4-9583-0572e7f39f66," +
                                         "29119285-2428-4863-b630-9b5aa095de13," +
                                         "03073703-3509-40f2-ba89-d85361c4021b," +
                                         "49108710-6c58-4e31-ac2d-3c4933040439," +
                                         "9dfdc3f7-88f7-4ff0-a671-b4094ac12b7a",
    model: Lizard.Models.Timeserie
  });



  dmc = new dmcCollection();

  if (account.get('authenticated')) {
    dmc.fetch({
      cache: false,
      success: function(collection) {
        var values = new Backbone.Model({
          debiet_l: collection.get('d856946f-feb6-4536-a878-af55c32cd96c').get('last_value'),
          debiet_r: collection.get('dd7a4db5-4261-4ac4-9583-0572e7f39f66').get('last_value'),
          temp_l: collection.get('29119285-2428-4863-b630-9b5aa095de13').get('last_value'),
          temp_r: collection.get('03073703-3509-40f2-ba89-d85361c4021b').get('last_value'),
          waterst_l: collection.get('49108710-6c58-4e31-ac2d-3c4933040439').get('last_value'),
          waterst_r: collection.get('9dfdc3f7-88f7-4ff0-a671-b4094ac12b7a').get('last_value')
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
