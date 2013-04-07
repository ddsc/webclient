(function ($) {
    var options = {
    };

    /* *************************************************** */

    function DataSet (lazyLoad, model) {
        this.lazyLoad = lazyLoad;
        this.url = model.get('events');
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

    function LazyLoadBackbone (plot) {
        this.plot = plot;
        this.timeout = null;
        this.datasets = [];
        this.preventUpdates = false;
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
        plot.getPlaceholder().unbind("plotzoom.lazyload");
        plot.getPlaceholder().unbind("plotpan.lazyload");
        plot.getPlaceholder().unbind("axisminmaxchanged.lazyload");
        // plot.getPlaceholder().unbind("dragstart.lazyload");
        // plot.getPlaceholder().unbind("dragend.lazyload");
    };

    LazyLoadBackbone.prototype.getExtraParams = function () {
        var xAxes = this.plot.getXAxes();
        var minX = xAxes[0].min;
        var maxX = xAxes[0].max;
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

    LazyLoadBackbone.prototype.observeCollection = function (backboneCollection) {
        var self = this;
        backboneCollection.on('add', function (model, collection) {
            var timeseries = model.get('timeseries');

            for (var i in self.datasets) {
                var dataset = self.datasets[i];
                if (dataset.url == timeseries.get('events')) {
                    // already loaded, do nothing
                    return;
                }
            }

            var dataset = new DataSet(self, timeseries);
            self.datasets.push(dataset);
            self.refreshData();
        });

        backboneCollection.on('remove', function (model, collection) {
            var timeseries = model.get('timeseries');

            for (var i in self.datasets) {
                var dataset = self.datasets[i];
                if (dataset.url == timeseries.get('events')) {
                    delete self.datasets[i];
                }
            }
            self.redraw();
        });
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
            // force fixed min and max for axes
            // options.xaxis.min = 0; //1970
            // options.xaxis.max = (new Date()).getTime(); // today
            // options.yaxis.min = 0;
            // options.yaxis.max = 10;
            plot.hooks.bindEvents.push(lazyLoad.bindEvents.bind(lazyLoad));
            plot.hooks.shutdown.push(lazyLoad.shutdown.bind(lazyLoad));
        }

        plot.observeCollection = lazyLoad.observeCollection.bind(lazyLoad);
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
