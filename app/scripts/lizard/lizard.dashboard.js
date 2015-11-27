Lizard.Dashboard = {};

Lizard.Dashboard.omzdDefinition = {
    debiet_l: 'D856946F-FEB6-4536-A878-AF55C32CD96C',
    debiet_r: 'DD7A4DB5-4261-4AC4-9583-0572E7F39F66',
    buitendruk: '5C8D7780-14C8-4237-9BCA-73849E7990B7',
    temp_l: '29119285-2428-4863-B630-9B5AA095DE13',
    temp_r: '03073703-3509-40F2-BA89-D85361C4021B',
    waterst_r: '49108710-6C58-4E31-AC2D-3C4933040439',
    waterst_l: '9DFDC3F7-88F7-4FF0-A671-B4094AC12B7A',
    activeDashboard: 'omzd'
};

Lizard.Dashboard.gdDefinition = {
    debiet_l: '5e7fe983-5839-44f4-a6c0-da3171aba7eb',
    debiet_r: '6a2c3135-0bc1-4927-a2eb-c1ed613fc070',
    buitendruk: '47c844fc-1eaa-453c-89cd-a3b59437e2f9',
    temp_l: '6a2c3135-0bc1-4927-a2eb-c1ed613fc070',
    temp_r: '03073703-3509-40F2-BA89-D85361C4021B',
    waterst_r: '49108710-6C58-4E31-AC2D-3C4933040439',
    waterst_l: '1c3e914e-af13-4f6c-9b96-7ffb7a0797d6',
    activeDashboard: 'gd'
};

var urlFunc = function (dmcDef) {
        var url = settings.timeseries_url + "?uuid=";
        var keys = Object.keys(dmcDef);
        for (var i = 0; keys.length > i; i++) {
            url += dmcDef[keys[i]] + ",";
        }
        return url;
    };


Lizard.Dashboard.omzd_dmc = Backbone.Collection.extend({
    url: function () {
        return urlFunc(Lizard.Dashboard.omzdDefinition);
    },
    model: Lizard.Models.Timeserie
});


Lizard.Dashboard.gd_dmc = Backbone.Collection.extend({
    url: function () {
        return urlFunc(Lizard.Dashboard.gdDefinition);
    },
    model: Lizard.Models.Timeserie
});

Lizard.Dashboard.renderWidget = function(dmcCollection, timeseries, options) {


    console.log('renderWidget options', options);

    // Instantiate Dashboard's default layout
    var dashboardView = new Lizard.Dashboard.DefaultLayout();
    Lizard.App.content.show(dashboardView);


    var widgetcollectionview = new Lizard.Views.WidgetCollection();

    if (account.get('authenticated')) {
        dmcCollection.fetch({
            cache: false,
            success: function(collection) {
                var values = new Backbone.Model({
                    debiet_l: collection.get(options.debiet_l).get('last_value'),
                    debiet_r: collection.get(options.debiet_r).get('last_value'),
                    temp_l: collection.get(options.temp_l).get('last_value'),
                    temp_r: collection.get(options.temp_r).get('last_value'),
                    waterst_l: collection.get(options.waterst_l).get('last_value'),
                    waterst_r: collection.get(options.waterst_r).get('last_value')
                });

                widgetcollectionview.collection.reset();
                widgetcollectionview.collection.add([
                    new Lizard.Models.Widget({
                        col: 1,
                        row: 1,
                        size_x: 2,
                        size_y: 4,
                        gaugeId: 4,
                        type: 'template',
                        active: (options.activeDashboard) ? options.activeDashboard : '',
                        template: '#dashboard-list'
                    }),
                    new Lizard.Models.Widget({
                        col: 3,
                        row: 1,
                        size_x: 7,
                        size_y: 4,
                        gaugeId: 3,
                        type: 'graph',
                        timeseries: timeseries
                    }),
                    new Lizard.Models.Widget({
                        col: 10,
                        row: 1,
                        size_x: 3,
                        size_y: 4,
                        gaugeId: 4,
                        type: 'legend'
                    }),
                    new Lizard.Models.Widget(_.extend({
                        col: 3,
                        row: 5,
                        size_x: 7,
                        size_y: 3,
                        gaugeId: 2,
                        type: 'template',
                        template: '#dmc-overview'
                    }, values.attributes)),
                    new Lizard.Models.Widget({
                        col: 10,
                        row: 5,
                        size_x: 3,
                        size_y: 2,
                        gaugeId: 4,
                        type: 'template',
                        template: '#dashboard-logo'
                    }),
                    new Lizard.Models.Widget({
                        col: 10,
                        row: 7,
                        size_x: 3,
                        size_y: 1,
                        gaugeId: 8,
                        type: 'template',
                        template: '#settings-button'
                    }),
                    new Lizard.Models.Widget({
                        col: 3,
                        row: 8,
                        size_x: 7,
                        size_y: 4,
                        gaugeId: 9,
                        type: 'template',
                        template: '#image-dmc'
                    }),
                    new Lizard.Models.Widget({
                        col: 10,
                        row: 8,
                        size_x: 3,
                        size_y: 2,
                        gaugeId: 5,
                        title: 'Debiet links',
                        label: 'm3',
                        value: values.get('debiet_l'),
                        max: 5000
                    }),
                    new Lizard.Models.Widget({
                        col: 10,
                        row: 10,
                        size_x: 3,
                        size_y: 2,
                        gaugeId: 7,
                        title: 'Debiet rechts',
                        label: 'liter',
                        value: values.get('debiet_r'),
                        max: 5000
                    })
                ]);

                dashboardView.dashboardRegion.show(widgetcollectionview.render());
            }
        });
    }
};

Lizard.Dashboard.DefaultLayout = Backbone.Marionette.Layout.extend({
    template: '#dashboard-template',
    regions: {
        'sidebarRegion': '#sidebarRegion',
        'dashboardRegion': '#dashboardRegion'
    },
    events: {
        'click #dmc': 'openDMC',
        'click #gd': 'openGD',
    },
    timeseriesFunc: function (dmcDef) {
        var timeseries = [];
        var keys = Object.keys(dmcDef);
        for (var i = 0; keys.length > i; i++) {
            timeseries.push(settings.timeseries_url + dmcDef[keys[i]]);
        }
        return timeseries;
    },
    openGD: function() {
        // Grechtdijk
        var dmc = new Lizard.Dashboard.gd_dmc();
        var timeseries = this.timeseriesFunc(Lizard.Dashboard.gdDefinition);
      
        Lizard.Dashboard.renderWidget(dmc, timeseries, Lizard.Dashboard.gdDefinition);
    },

    openDMC: function() {
        // Ommelandse Zeedijk
        var dmc = new Lizard.Dashboard.omzd_dmc();
        var timeseries = this.timeseriesFunc(Lizard.Dashboard.omzdDefinition);

        Lizard.Dashboard.renderWidget(dmc, timeseries, Lizard.Dashboard.omzdDefinition);
    }
});

Lizard.Dashboard.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        'dashboard': 'dashboard'
    }
});



Lizard.Dashboard.dashboard = function() {

    // initially load the omzd dashboard...

    dmc = new Lizard.Dashboard.omzd_dmc();
    var timeseries = [];
    var keys = Object.keys(Lizard.Dashboard.omzdDefinition);
    for (var i = 0; keys.length > i; i++) {
        timeseries.push(settings.timeseries_url + Lizard.Dashboard.omzdDefinition[keys[i]]);
    }

    Lizard.Dashboard.renderWidget(dmc, timeseries, Lizard.Dashboard.omzdDefinition);

    Backbone.history.navigate('dashboard');
};

Lizard.App.addInitializer(function() {
    Lizard.Dashboard.router = new Lizard.Dashboard.Router({
        controller: Lizard.Dashboard
    });
});