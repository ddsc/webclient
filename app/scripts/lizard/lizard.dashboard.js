Lizard.Dashboard = {};

Lizard.Dashboard.dashboardDefinition = {
    omzd: {
        timeseries: { //timeseries for the graph and for latest values shown dashboard
            debiet_l: 'd856946f-feb6-4536-a878-af55c32cd96c',  // Actueel Debiet Dijk Links
            debiet_r: 'dd7a4db5-4261-4ac4-9583-0572e7f39f66',  // Actueel Debiet Dijk Rechts
            buitendruk: '5c8d7780-14c8-4237-9bca-73849e7990b7',  // Buitendruk in kPa
            temp_l: '29119285-2428-4863-b630-9b5aa095de13',  // Temperatuur Dijk Links
            temp_r: '03073703-3509-40f2-ba89-d85361c4021b',  // Temperatuur Dijk Rechts
            waterst_r: '49108710-6c58-4e31-ac2d-3c4933040439',  // Waterkolom dijk links in mNAP
            waterst_l: '9dfdc3f7-88f7-4ff0-a671-b4094ac12b7a'  // Waterkolom dijk rechts in mNAP
        },
        check_ts: '29119285-2428-4863-b630-9b5aa095de13', // timeseries for checking access to dashboard
        id: 'omzd', // identifier, equal to key
        nr_systems: 2, // nr of DMC systems
        name: 'DMC Ommelanderzeedijk' // name of dashboard
    },
    vees: {
        timeseries: {
            debiet_l: '5e7fe983-5839-44f4-a6c0-da3171aba7eb',
            //debiet_r: '6a2c3135-0bc1-4927-a2eb-c1ed613fc070',
            buitendruk: '47c844fc-1eaa-453c-89cd-a3b59437e2f9',
            buitenwaterstand: '6ef9958d-25e1-48b8-9993-1c0820352874',
            //temp_l: '6a2c3135-0bc1-4927-a2eb-c1ed613fc070',
            //temp_r: '03073703-3509-40f2-ba89-d85361c4021b',
            //waterst_r: '49108710-6c58-4e31-ac2d-3c4933040439',
            waterst_l: '1c3e914e-af13-4f6c-9b96-7ffb7a0797d6',
            debiet_cum_l: '6a2c3135-0bc1-4927-a2eb-c1ed613fc070'
        },
        check_ts: '5e7fe983-5839-44f4-a6c0-da3171aba7eb',
        id: 'vees',
        nr_systems: 1,
        name: 'DMC Veessen'
    }
}

var urlFunc = function (dmcDef) {        
        var url = settings.timeseries_url + "?uuid=";
        var keys = Object.keys(dmcDef);
        for (var i = 0; keys.length > i; i++) {
            url += dmcDef[keys[i]] + ",";
        }
        return url;
    };

var timeseriesUrlFunc = function(dmcTimeseries) {
    var timeseries = [];
    for (var key in dmcTimeseries) {
        timeseries.push(settings.timeseries_url + dmcTimeseries[key]);
    }
    return timeseries;
}

function get_last_value_or_slash(col, timeserie_key) {
    if (col.get(timeserie_key) == undefined) {
        return Number.NaN;
    } else {
        return col.get(timeserie_key).get('last_value');
    }
}

Lizard.Dashboard.getSelectionWidget = function(options, active_id) {

    data = []
    for (key in this.dashboard_status) {
        if (this.dashboard_status[key] == true) {
            data.push({iid: key,
                       name: this.dashboardDefinition[key].name,
                        active: key === active_id});
        }
    }

    return new Lizard.Models.Widget({
                col: 1,
                row: 1,
                size_x: 2,
                size_y: 4,
                gaugeId: 4,
                type: 'template',
                active: active_id,
                items: data,
                template: '#dashboard-list'
            });
}

Lizard.Dashboard.renderWidget = function(key) {

    console.log('renderWidget key', key);

    // Instantiate Dashboard's default layout
    var dashboardView = new Lizard.Dashboard.DefaultLayout();
    Lizard.App.content.show(dashboardView);
    var options = this.dashboardDefinition[key];
    var widgetcollectionview = new Lizard.Views.WidgetCollection();

    if (key == null) {
        // only show navigation
        widgetcollectionview.collection.reset();
        widgets = [
            this.getSelectionWidget(options, key)
        ]
        widgetcollectionview.collection.add(widgets);
        dashboardView.dashboardRegion.show(widgetcollectionview.render());
        Backbone.history.navigate('dashboard');
        return;
    }

    var self = this;
    var dashboardModelClass = Backbone.Collection.extend({
        url: function () {
            return urlFunc(self.dashboardDefinition[key].timeseries);
        },
        model: Lizard.Models.Timeserie
    });

    var dmcCollection = new dashboardModelClass();
    var timeseries = timeseriesUrlFunc(self.dashboardDefinition[key].timeseries);

    if (account.get('authenticated')) {
        dmcCollection.fetch({
            cache: false,
            success: function(collection) {
                var values = new Backbone.Model({
                    debiet_l: get_last_value_or_slash(collection, options.timeseries.debiet_l),
                    debiet_r: get_last_value_or_slash(collection, options.timeseries.debiet_r),
                    temp_l: get_last_value_or_slash(collection, options.timeseries.temp_l),
                    temp_r: get_last_value_or_slash(collection, options.timeseries.temp_r),
                    waterst_l: get_last_value_or_slash(collection, options.timeseries.waterst_l),
                    waterst_r: get_last_value_or_slash(collection, options.timeseries.waterst_r),
                    debiet_cum_l: get_last_value_or_slash(collection, options.timeseries.debiet_cum_l),
                    debiet_cum_r: get_last_value_or_slash(collection, options.timeseries.debiet_cum_r)
                });

                widgetcollectionview.collection.reset();
                widgets = [
                    self.getSelectionWidget(options, key),
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
                        col: 10,
                        row: 8,
                        size_x: 3,
                        size_y: 2,
                        gaugeId: 5,
                        title: 'Dag debiet links',
                        label: 'liter',
                        value: values.get('debiet_cum_l'),
                        max: 60000
                    }),
                ]

                if (options.nr_systems == 2) {
                    widgets = widgets.concat([
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
                            row: 10,
                            size_x: 3,
                            size_y: 2,
                            gaugeId: 7,
                            title: 'Dag debiet rechts',
                            label: 'liter',
                            value: values.get('debiet_cum_r'),
                            max: 60000
                        }),
                        new Lizard.Models.Widget(_.extend({
                            col: 3,
                            row: 5,
                            size_x: 7,
                            size_y: 3,
                            gaugeId: 2,
                            type: 'template',
                            template: '#dmc-overview-2'
                        }, values.attributes))
                    ]);
                } else {
                   widgets = widgets.concat([
                        new Lizard.Models.Widget(_.extend({
                            col: 3,
                            row: 5,
                            size_x: 7,
                            size_y: 3,
                            gaugeId: 2,
                            type: 'template',
                            template: '#dmc-overview-1'
                        }, values.attributes))
                   ])
                }
                widgetcollectionview.collection.add(widgets);

                dashboardView.dashboardRegion.show(widgetcollectionview.render());
                Backbone.history.navigate('dashboard/'+key);
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
        'click a.opendash': 'openDashboard'
    },
    openDashboard: function(e) {
        e.preventDefault();
        var id = $(e.currentTarget).attr("id");
        //var item = this.collection.get(id);

        Lizard.Dashboard.renderWidget(id);
    }
});

Lizard.Dashboard.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        'dashboard': 'dashboard',
        'dashboard/:id': 'dashboard'
    }
});

Lizard.Dashboard.dashboard = function(id_active_dashboard) {
    var self = this;


    // if status is clear, render widget
    //if (typeof(this.dashboard_status) != 'undefined') {
    //    Lizard.Dashboard.renderWidget(id_active_dashboard);
    //    return
    //}

    this.dashboard_status = {};

    // callback function. Decide which dashboard will be showed
    var selectCallback = function(prefered) {
        if (prefered) {
            if (prefered in self.dashboard_status && self.dashboard_status[prefered] == true) {
                // Backbone.history.navigate('dashboard/'+id_active_dashboard);
                Lizard.Dashboard.renderWidget(prefered);
            } else {
                // don't select any initially (the one selected through the uri
                // does not exist or is not accesible for this user
                // Backbone.history.navigate('dashboard/'+id_active_dashboard);
                Lizard.Dashboard.renderWidget(null);
            }
        } else {
            //select first accessible dashboard
            for (var key in self.dashboard_status) {
                if (self.dashboard_status[key] == true) {
                    // Backbone.history.navigate('dashboard/');
                    Lizard.Dashboard.renderWidget(key);
                    break;

                }
            }
        }
    }


    for (var dashboard_id in this.dashboardDefinition) {
        var checkUrl = Backbone.Collection.extend({
            url: function () {
                var url = settings.timeseries_url + "?uuid=";
                url += self.dashboardDefinition[dashboard_id].check_ts;
                return url;
            },
            model: Lizard.Models.Timeserie
        });

        check_collection = new checkUrl();

        check_collection.fetch({
            cache: false,
            success: function (dashb_id, data, obj) {
                if (obj.count > 0) {
                    self.dashboard_status[dashb_id] = true;
                } else {
                    self.dashboard_status[dashb_id] = false;
                }
                if (Object.keys(self.dashboard_status).length ==
                            Object.keys(self.dashboardDefinition).length) {
                    selectCallback(id_active_dashboard)
                }
            }.bind(this, dashboard_id),
            error: function (dashb_id) {
                self.dashboard_status[dashb_id] = false;
                if (Object.keys(self.dashboard_status).length ==
                            Object.keys(self.dashboardDefinition).length) {
                    selectCallback(id_active_dashboard)
                }
            }.bind(this, dashboard_id)
        });
    }
}

Lizard.App.addInitializer(function() {
    Lizard.Dashboard.router = new Lizard.Dashboard.Router({
        controller: Lizard.Dashboard
    });
});
