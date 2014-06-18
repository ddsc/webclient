(function ($) {
    var options = {
    };

    /* *************************************************** */

    function DataSet (lazyLoad, events_url, color, uuid, primary) {
        this.lazyLoad = lazyLoad;
        this.url = events_url;
        this.color = color;
        this.primary = (primary) ? true : false;
        this.uuid = uuid;
        this.needsUpdate = true;
        this.data = [];
        this.label = '';
        this.parameterPk = null;
        this.axisLabel = null;
        this.axisLabelX = null;
        this.axisLabelY = null;
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
            if (data.parameter_pk) {
                self.parameterPk = data.parameter_pk;
            }
            if (data.axis_label) {
                self.axisLabel = data.axis_label;
            }
            if (data.axis_label_x) {
                self.axisLabelX = data.axis_label_x;
            }
            if (data.axis_label_y) {
                self.axisLabelY = data.axis_label_y;
            }
            for (var key in data) {
                if (/^timer/.test(key)) { console.log(data.label + ': ' + key + ' = ' + data[key]); }
            }
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
        this.scatterplot = false;
    }

    LazyLoadBackbone.prototype.scheduleUpdateAll = function (event) {
        if (this.preventUpdates) {
            return;
        }

        if (this.timeout != null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.timeout = setTimeout(this.fetchData.bind(this, true), 750);
    };

    LazyLoadBackbone.prototype.fetchData = function (updateAll) {
        var self = this;

        if (this.preventUpdates) {
            return;
        }

        var xAxis = this.plot.getXAxes()[0];
        var xAxisOptions = xAxis.options;
        if (this.graphModel) {
            xAxisOptions.min = this.graphModel.get('dateRange').get('start');
            xAxisOptions.max = this.graphModel.get('dateRange').get('end');
            xAxis.min = this.graphModel.get('dateRange').get('start');
            xAxis.max = this.graphModel.get('dateRange').get('end');
        }

        for (var i in this.datasets) {
            var dataset = this.datasets[i];
            if (updateAll === true || dataset.needsUpdate) {
                dataset.fetch(function () {
                    if (dataset.primary) {
                        var response = arguments[0];
                        var dataEnd;
                        if (response.data.length > 0 ) {
                            dataEnd = new Date(response.data[response.data.length - 1][0]);                    
                        } else {
                            dataEnd = moment();
                        }
                        var dateRangeStart;
                        try {
                            dateRangeStart = self.graphModel.get('dateRange').get('start');
                        } catch (e) {
                            console.log(e);
                            dateRangeStart = dataEnd.day(-1);
                        } 
                        var dateDelta = dataEnd - dateRangeStart;
                        if (self.graphModel !== null) {
                            self.graphModel.get('dateRange').set('end', dataEnd, {silent: true});
                        }
                        if (dataEnd < dateRangeStart) {
                            if (response.data.length < 2) {
                                var dataStart = new Date(dataEnd - dateDelta);
                            } else {
                                var dataStart = new Date(arguments[0].data[0][0]);
                            }
                            self.graphModel.get('dateRange').set('start', dataStart, {silent: true});
                            Lizard.App.vent.trigger('daterangermanger');
                            var xAxis = self.plot.getXAxes()[0];
                            var xAxisOptions = xAxis.options;
                                xAxisOptions.min = dataStart
                                xAxisOptions.max = dataEnd
                                xAxis.min = dataStart
                                xAxis.max = dataEnd
                        }

                        self.redraw();
                    }
                    
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
                yAxes[yaxis - 1].options.axisLabel = dataset.axisLabel;
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
        this.plot.getPlaceholder().on('plotpan.lazyload', this.plotPannedZoomed.bind(this));
        this.plot.getPlaceholder().on('plotzoom.lazyload', this.plotPannedZoomed.bind(this));
    };

    LazyLoadBackbone.prototype.shutdown = function (plot, eventHolder) {
        this.datasets = [];
        this.stopObservingGraphModel();
        this.plot.getPlaceholder().off('plotpan.lazyload');
        this.plot.getPlaceholder().off('plotzoom.lazyload');
    };

    LazyLoadBackbone.prototype.getExtraParams = function () {
        var xaxis = this.plot.getXAxes()[0];
        var minX = xaxis.min;
        var maxX = xaxis.max;
        var params = {
            eventsformat: 'flot',
            ignore_rejected: 'true'
        };

        var start = null;
        var end = null;
        if (minX !== -1 && maxX !== 1 && minX < maxX) {
            // use current zoom extent
            start = minX;
            end = maxX;
        }
        else if (xaxis.options.min && xaxis.options.max) {
            // no initial zoom extent set, use whatever the graph is initialized with
            start = xaxis.options.min;
            end = xaxis.options.max;
        }

        // convert back to Date objects in case of timestamps
        if (typeof start === 'number') {
            start = new Date(start);
        }
        if (typeof end === 'number') {
            end = new Date(end);
        }

        // use global start and end, instead of axes viewpoint
        if (this.scatterplot) {
            start = this.graphModel.get('dateRange').get('start');
            end = this.graphModel.get('dateRange').get('end');  
        }

        if (start && end) {
            // convert to iso 8601 and append to parameters
            $.extend(params, {
                start: new Date(start).toJSON(),
                end: new Date(end).toJSON()
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

        if (this.scatterplot) {
            var secondDataset = this.datasets[1];
            $.extend(params, {
                combine_with: secondDataset.uuid
            });
        }

        return params;
    };

    LazyLoadBackbone.prototype.addGraphItem = function (model) {
        var timeseries = model.get('timeseries');
        var eventsUrl = timeseries.get('events');
        var color = model.get('color');

        for (var i in this.datasets) {
            var dataset = this.datasets[i];
            if (dataset.url == eventsUrl) {
                // already loaded, do nothing
                return;
            }
        }

        var primary = (this.datasets.length > 0) ? false : true;
        var dataset = new DataSet(this, eventsUrl, color, timeseries.get('uuid'), primary);
        this.datasets.push(dataset);
        this.fetchData();
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

        var graphItems = graphModel.get('graphItems');

        // listen for any changes
        graphModel.get('dateRange').on('change:start change:end', this.startEndChanged, this);
        graphItems.on('add', this.bbAddHandler, this);
        graphItems.on('remove', this.bbRemoveHandler, this);
        graphItems.on('reset', this.bbResetHandler, this);

        // load the initial set
        graphItems.each(function (graphItem) {
            self.setPreventUpdates(true);
            self.addGraphItem(graphItem);
            self.setPreventUpdates(false);
        });
        this.fetchData();
    };

    LazyLoadBackbone.prototype.stopObservingGraphModel = function () {
        if (this.graphModel != null) {
            var graphModel = this.graphModel;

            var graphItems = graphModel.get('graphItems');

            // remove all model event handlers
            graphModel.get('dateRange').off('change:start change:end', this.startEndChanged, this);
            graphItems.off('add', this.bbAddHandler, this);
            graphItems.off('remove', this.bbRemoveHandler, this);
            graphItems.off('reset', this.bbResetHandler, this);

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

    /* ************************************************************** */
    /* ************************************************************** */
    /* ************************************************************** */
    /* ************************************************************** */
    /* ************************************************************** */

    function LazyLoadBackboneScatter (plot) {
        LazyLoadBackbone.apply(this, arguments);
        this.scatterplot = true;
    }
    LazyLoadBackboneScatter.prototype = new LazyLoadBackbone();

    LazyLoadBackboneScatter.prototype.fetchData = function (updateAll) {
        var self = this;

        if (this.preventUpdates) {
            return;
        }

        if (this.datasets.length !== 2) {
            return;
        }

        var firstDataset = this.datasets[0];
        if (updateAll === true || firstDataset.needsUpdate) {
            firstDataset.fetch(function () {
                self.redraw();
            });
        }
    };

    LazyLoadBackboneScatter.prototype.redraw = function () {
        var firstDataset = this.datasets[0];
        if (firstDataset) {
            var line = {
                yaxis: 1,
                data: firstDataset.data
            };
            this.setPreventUpdates(true);
            this.plot.getXAxes()[0].options.axisLabel = firstDataset.axisLabelX;
            this.plot.getYAxes()[0].options.axisLabel = firstDataset.axisLabelY;
            this.plot.setData([line]);
            this.plot.setupGrid();
            this.plot.draw();
            this.plot.triggerRedrawOverlay();
            this.setPreventUpdates(false);
        }
    };

    LazyLoadBackboneScatter.prototype.bindEvents = function (plot, eventHolder) {
    };

    LazyLoadBackboneScatter.prototype.shutdown = function (plot, eventHolder) {
        this.datasets = [];
        this.stopObservingGraphModel();
    };

    /* *************************************************** */

    function init (plot) {
        function processOptions (plot, options) {
            var lazyLoad = null;

            lazyLoad = new LazyLoadBackbone(plot);

            if (options.scatterplot && options.scatterplot.enabled) {
                lazyLoad = new LazyLoadBackboneScatter(plot);
            }
            plot.hooks.bindEvents.push(lazyLoad.bindEvents.bind(lazyLoad));
            plot.hooks.shutdown.push(lazyLoad.shutdown.bind(lazyLoad));

            plot.observeGraphModel = lazyLoad.observeGraphModel.bind(lazyLoad);
            plot.setPreventUpdates = lazyLoad.setPreventUpdates.bind(lazyLoad);
        }

        plot.hooks.processOptions.push(processOptions);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'lazyload-backbone',
        version: '1.0-nens'
    });
})(jQuery);
