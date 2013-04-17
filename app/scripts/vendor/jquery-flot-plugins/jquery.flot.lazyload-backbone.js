(function ($) {
    var options = {
    };

    /* *************************************************** */

    function DataSet (lazyLoad, events_url, color) {
        this.lazyLoad = lazyLoad;
        this.url = events_url;
        this.color = color;
        this.needsUpdate = true;
        this.data = [];
        this.label = '';
        this.parameterPk = null;
        this.parameterName = null;
        this.xmin = null;
        this.xmax = null;
        this.xhr = null;
    }

    DataSet.prototype.fetch = function (successCallback) {
        var self = this;
        // cancel previous XHR
        if (this.xhr !== null) {
            this.xhr.abort();
            this.xhr = null;
        }

        // perform XHR
        this.xhr = $.get(
            this.url,
            this.lazyLoad.getExtraParams(),
            undefined,
            'json'
        )
        .done(function (data, textStatus, jqXHR) {
            self.data = data.data;
            self.label = data.label;
            self.parameterPk = data.parameter_pk;
            self.parameterName = data.parameter_name;
            self.xmin = data.xmin;
            self.xmax = data.xmax;
            self.needsUpdate = false;
            if (typeof successCallback !== 'undefined') {
                successCallback(self);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            if (textStatus !== 'abort') {
                console.error('Error loading data from ' + self.url + ': ' + errorThrown);
            }
        })
        .complete(function () {
            self.xhr = null;
        });
    };

    /* ************************************************************** */
    /* ************************************************************** */
    /* ************************************************************** */
    /* ************************************************************** */
    /* ************************************************************** */

    function LazyLoadBackbone (plot) {
        this.plot = plot;
        this.timeout = null;
        this.datasets = [];
        this.preventUpdates = false;
        this.backboneCollection = null;
        this.accountModel = null;
    }

    LazyLoadBackbone.prototype.scheduleUpdateAll = function (event) {
        if (this.preventUpdates) {
            return;
        }

        if (this.timeout != null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.timeout = setTimeout(this.refreshData.bind(this, true), 750);
    };

    LazyLoadBackbone.prototype.refreshData = function (updateAll) {
        var self = this;

        if (this.preventUpdates) {
            return;
        }

        for (var i in this.datasets) {
            var dataset = this.datasets[i];
            if (updateAll === true || dataset.needsUpdate) {
                dataset.fetch(function () {
                    self.redraw();
                });
            }
        }
    };

    LazyLoadBackbone.prototype.redraw = function () {
        var parameterPkToYAxis = {};
        var allocatedYAxes = 0;
        var newData = [];

        // Used to determine yaxis per parameter.
        var yAxes = this.plot.getYAxes();

        for (var i in this.datasets) {
            var dataset = this.datasets[i];
            var line = {};

            // Create a new axis only when we discover a new parameter.
            var yaxis = 1;
            if (dataset.parameterPk in parameterPkToYAxis) {
                yaxis = parameterPkToYAxis[dataset.parameterPk];
            }
            else {
                // Allocate a new axis.
                yaxis = allocatedYAxes + 1;
                allocatedYAxes++;
                // Set the axisLabel of the new axis.
                yAxes[yaxis - 1].options.axisLabel = dataset.parameterName;
                // Add the axis to a map so any following dataset can find
                // a suitable axis for their parameters.
                parameterPkToYAxis[dataset.parameterPk] = yaxis;
            }

            // Append the line.
            line.data = dataset.data;
            line.yaxis = yaxis;
            line.label = dataset.label;
            line.color = dataset.color;
            newData.push(line);
        }

        var xaxis = this.plot.getXAxes()[0];
        if (this.datasets.length == 1 && xaxis.min === null && xaxis.max === null) {
            // First and only line, so use it to determine axis bounds.
            // Note: not implemented yet, unsure if needed
        }

        this.setPreventUpdates(true);
        this.plot.setData(newData);
        this.plot.setupGrid();
        // if (this.datasets.length == 1) {
        // }
        this.plot.draw();
        this.plot.triggerRedrawOverlay();
        this.setPreventUpdates(false);
    };

    LazyLoadBackbone.prototype.setPreventUpdates = function (preventUpdates) {
        this.preventUpdates = preventUpdates;
    };

    LazyLoadBackbone.prototype.bindEvents = function (plot, eventHolder) {
        plot.getPlaceholder().bind("plotzoom.lazyload", this.scheduleUpdateAll.bind(this));
        plot.getPlaceholder().bind("plotpan.lazyload", this.scheduleUpdateAll.bind(this));
        plot.getPlaceholder().bind("axisminmaxchanged.lazyload", this.scheduleUpdateAll.bind(this));
        // plot.getPlaceholder().bind("dragstart.lazyload", this.setPreventUpdates.bind(this, true));
        // plot.getPlaceholder().bind("dragend.lazyload", this.setPreventUpdates.bind(this, false));
    };

    LazyLoadBackbone.prototype.shutdown = function (plot, eventHolder) {
        this.stopObservingCollection();
        this.stopObservingInitialPeriod();
        plot.getPlaceholder().unbind("plotzoom.lazyload");
        plot.getPlaceholder().unbind("plotpan.lazyload");
        plot.getPlaceholder().unbind("axisminmaxchanged.lazyload");
        // plot.getPlaceholder().unbind("dragstart.lazyload");
        // plot.getPlaceholder().unbind("dragend.lazyload");
    };

    LazyLoadBackbone.prototype.getExtraParams = function () {
        var xaxis = this.plot.getXAxes()[0];
        var minX = xaxis.min;
        var maxX = xaxis.max;
        var params = {
            eventsformat: 'flot'
        };

        if (minX !== -1 && maxX !== 1 && minX < maxX) {
            // convert back to Date and create a iso8601 timestring
            minX = (new Date(minX)).toJSON();
            maxX = (new Date(maxX)).toJSON();

            // append to parameters
            $.extend(params, {
                start: minX,
                end: maxX
            });
        }

        // these are used on the server to determine Douglas-Peucker tolerance
        var width = this.plot.getPlaceholder().width();
        var height = this.plot.getPlaceholder().height();

        if (width && height) {
            // append to parameters
            $.extend(params, {
                width: width,
                height: height
            });
        }

        return params;
    };

    LazyLoadBackbone.prototype.addGraphItem = function (model) {
        var timeseries = model.get('timeseries');
        var events_url = timeseries.get('events');
        var color = model.get('color');

        for (var i in this.datasets) {
            var dataset = this.datasets[i];
            if (dataset.url == events_url) {
                // already loaded, do nothing
                return;
            }
        }

        var dataset = new DataSet(this, events_url, color);
        this.datasets.push(dataset);
        this.refreshData();
    };

    LazyLoadBackbone.prototype.bbAddHandler = function (model, collection) {
        this.addGraphItem(model);
    };

    LazyLoadBackbone.prototype.bbRemoveHandler = function (model, collection) {
        var timeseries = model.get('timeseries');

        for (var i in this.datasets) {
            var dataset = this.datasets[i];
            if (dataset.url == timeseries.get('events')) {
                delete this.datasets[i];
            }
        }
        this.redraw();
    };

    LazyLoadBackbone.prototype.bbResetHandler = function (model, collection) {
        this.datasets.length = 0;
        this.redraw();
    };

    LazyLoadBackbone.prototype.observeCollection = function (backboneCollection) {
        var self = this;
        if (this.backboneCollection != null) {
            throw 'backboneCollection already defined';
        }
        this.backboneCollection = backboneCollection;

        // load the initial set
        backboneCollection.each(function (model) {
            self.addGraphItem(model);
        });

        // listen for changes
        backboneCollection.on('add', this.bbAddHandler, this);
        backboneCollection.on('remove', this.bbRemoveHandler, this);
        backboneCollection.on('reset', this.bbResetHandler, this);
    };

    LazyLoadBackbone.prototype.stopObservingCollection = function () {
        if (this.backboneCollection != null) {
            this.backboneCollection.off('add', this.bbAddHandler, this);
            this.backboneCollection.off('remove', this.bbRemoveHandler, this);
            this.backboneCollection.off('reset', this.bbResetHandler, this);
            this.backboneCollection = null;
        }
    };

    LazyLoadBackbone.prototype.readInitialPeriodFromModel = function () {
        var xaxis = this.plot.getXAxes()[0];
        var initialPeriod = this.accountModel.get('initialPeriod');
        var max = moment();
        var min = null;
        switch (initialPeriod) {
            case '24h':
                min = moment(max).subtract('hours', 24);
                break;
            case '48h':
                min = moment(max).subtract('hours', 48);
                break;
            case '1w':
                min = moment(max).subtract('weeks', 1);
                break;
            case '1m':
                min = moment(max).subtract('months', 1);
                break;
            case '1y':
                min = moment(max).subtract('years', 1);
                break;
            default:
                // take extent from data
                max = null;
                min = null;
        }
        if (min && max) {
            min = min.toDate();
            max = max.toDate();
        }
        xaxis.options.min = min;
        xaxis.options.max = max;
        this.scheduleUpdateAll();
    };

    LazyLoadBackbone.prototype.observeInitialPeriod = function (accountModel) {
        if (this.accountModel != null) {
            throw 'accountModel already defined';
        }
        this.accountModel = accountModel;

        // initial read
        this.readInitialPeriodFromModel();

        this.accountModel.on('change', this.readInitialPeriodFromModel, this);
    };

    LazyLoadBackbone.prototype.stopObservingInitialPeriod = function () {
        if (this.accountModel != null) {
            this.accountModel.off('change', this.readInitialPeriodFromModel, this);
            this.accountModel = null;
        }
    };

    LazyLoadBackbone.prototype.removeAllDataUrls = function () {
        this.datasets = [];
        //this.refreshData();
        this.redraw();
    };

    /* *************************************************** */

    function init (plot) {
        var lazyLoad = new LazyLoadBackbone(plot);

        function processOptions (plot, options) {
            plot.hooks.bindEvents.push(lazyLoad.bindEvents.bind(lazyLoad));
            plot.hooks.shutdown.push(lazyLoad.shutdown.bind(lazyLoad));
        }

        plot.observeCollection = lazyLoad.observeCollection.bind(lazyLoad);
        plot.observeInitialPeriod = lazyLoad.observeInitialPeriod.bind(lazyLoad);
        plot.setPreventUpdates = lazyLoad.setPreventUpdates.bind(lazyLoad);

        plot.hooks.processOptions.push(processOptions);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'lazyload-backbone',
        version: '1.0-nens'
    });
})(jQuery);
