(function ($) {
    var options = {
    };

    /* *************************************************** */

    function ScatterPlot (plot) {
        this.plot = plot;
        this.xhr = null;
        this.url = null;
        this.combineWith = null;
    }

    ScatterPlot.prototype.bindEvents = function (plot, eventHolder) {
    };

    ScatterPlot.prototype.shutdown = function (plot, eventHolder) {
    };

    ScatterPlot.prototype.getExtraParams = function () {
        return {
            data_format: 'flot',
            combine_with: this.combineWith
        };
    };

    ScatterPlot.prototype.loadScatterPlotData = function (url, combineWith) {
        var self = this;
        this.url = url;
        this.combineWith = combineWith;

        // cancel previous XHR
        if (this.xhr !== null) {
            this.xhr.abort();
            this.xhr = null;
        }

        // perform XHR
        this.xhr = $.get(
            url,
            this.getExtraParams(),
            undefined,
            'json'
        )
        .done(function (data, textStatus, jqXHR) {
            var line = {
                data: data.data
            };
            self.plot.getXAxes()[0].options.axisLabel = data.label;
            self.plot.setData([line]);
            self.plot.setupGrid();
            self.plot.draw();
            self.plot.triggerRedrawOverlay();
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

    /* *************************************************** */

    function init (plot) {
        var handler = new ScatterPlot(plot);

        function processOptions (plot, options) {
            if (!options.scatterplot || !options.scatterplot.enabled) {
                return;
            }
            plot.hooks.bindEvents.push(handler.bindEvents.bind(handler));
            plot.hooks.shutdown.push(handler.shutdown.bind(handler));
            plot.loadScatterPlotData = handler.loadScatterPlotData.bind(handler);
        }

        plot.hooks.processOptions.push(processOptions);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'scatterplot',
        version: '1.0-nens'
    });
})(jQuery);
