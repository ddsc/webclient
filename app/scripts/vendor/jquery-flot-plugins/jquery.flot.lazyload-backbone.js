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
        this.graphModel = null;
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

        var xAxis = this.plot.getXAxes()[0];
        var xAxisOptions = xAxis.options;
        xAxisOptions.min = this.graphModel.get('dateRange').get('start');
        xAxisOptions.max = this.graphModel.get('dateRange').get('end');
        xAxis.min = this.graphModel.get('dateRange').get('start');
        xAxis.max = this.graphModel.get('dateRange').get('end');

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
        //plot.getPlaceholder().bind("plotzoom.lazyload", this.scheduleUpdateAll.bind(this));
        //plot.getPlaceholder().bind("plotpan.lazyload", this.scheduleUpdateAll.bind(this));
        //plot.getPlaceholder().bind("axisminmaxchanged.lazyload", this.scheduleUpdateAll.bind(this));
        // plot.getPlaceholder().bind("dragstart.lazyload", this.setPreventUpdates.bind(this, true));
        // plot.getPlaceholder().bind("dragend.lazyload", this.setPreventUpdates.bind(this, false));
    };

    LazyLoadBackbone.prototype.shutdown = function (plot, eventHolder) {
        this.datasets = [];
        this.stopObservingGraphModel();
        //plot.getPlaceholder().unbind("plotzoom.lazyload");
        //plot.getPlaceholder().unbind("plotpan.lazyload");
        //plot.getPlaceholder().unbind("axisminmaxchanged.lazyload");
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

        var start = null;
        var end = null;
        if (minX !== -1 && maxX !== 1 && minX < maxX) {
            // use current zoom extent
            // convert back to Date and create a iso8601 timestring
            start = (new Date(minX)).toJSON();
            end = (new Date(maxX)).toJSON();
        }
        else if (xaxis.options.min && xaxis.options.max) {
            // no initial zoom extent set, use whatever the graph is initialized with
            start = xaxis.options.min.toJSON();
            end = xaxis.options.max.toJSON();
        }

        if (start && end) {
            // append to parameters
            $.extend(params, {
                start: start,
                end: end
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

    LazyLoadBackbone.prototype.observeGraphModel = function (graphModel) {
        var self = this;
        if (this.graphModel != null) {
            throw 'graphModel already defined';
        }
        this.graphModel = graphModel;
        var backboneCollection = graphModel.get('graphItems');

        // load the initial set
        backboneCollection.each(function (model) {
            self.setPreventUpdates(true);
            self.addGraphItem(model);
            self.setPreventUpdates(false);
        });

        // listen for changes
        graphModel.get('dateRange').on('change:start change:end', this.startEndChanged, this);
        this.plot.getPlaceholder().on('plotpan.lazyload', this.plotPannedZoomed.bind(this));
        this.plot.getPlaceholder().on('plotzoom.lazyload', this.plotPannedZoomed.bind(this));
        backboneCollection.on('add', this.bbAddHandler, this);
        backboneCollection.on('remove', this.bbRemoveHandler, this);
        backboneCollection.on('reset', this.bbResetHandler, this);
    };

    LazyLoadBackbone.prototype.stopObservingGraphModel = function () {
        if (this.graphModel != null) {
            var graphModel = this.graphModel;
            var backboneCollection = graphModel.get('graphItems');
            graphModel.get('dateRange').off('change:start change:end', this.startEndChanged, this);
            this.plot.getPlaceholder().off('plotpan.lazyload');
            this.plot.getPlaceholder().off('plotzoom.lazyload');
            backboneCollection.off('add', this.bbAddHandler, this);
            backboneCollection.off('remove', this.bbRemoveHandler, this);
            backboneCollection.off('reset', this.bbResetHandler, this);
            this.graphModel = null;
        }
    };

    LazyLoadBackbone.prototype.startEndChanged = function () {
        this.scheduleUpdateAll();
    };

    LazyLoadBackbone.prototype.plotPannedZoomed = function (event, plot) {
        var xAxis = plot.getXAxes()[0];
        var xAxisOptions = xAxis.options;
        if (xAxisOptions.mode == 'time' && this.graphModel) {
            var start = xAxisOptions.min;
            var end = xAxisOptions.max;
            this.graphModel.get('dateRange').set({
                start: new Date(start),
                end: new Date(end)
            });
        }
    };

    /* *************************************************** */

    function init (plot) {
        var lazyLoad = new LazyLoadBackbone(plot);

        function processOptions (plot, options) {
            plot.hooks.bindEvents.push(lazyLoad.bindEvents.bind(lazyLoad));
            plot.hooks.shutdown.push(lazyLoad.shutdown.bind(lazyLoad));
        }

        plot.observeGraphModel = lazyLoad.observeGraphModel.bind(lazyLoad);
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
