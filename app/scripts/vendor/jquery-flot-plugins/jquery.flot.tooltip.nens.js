(function($) {
    var options = {
        tooltip: {
            enabled: false,
            monthNames: [],
            dayNames: []
        }
    };

	function init (plot) {
        var monthNames = [];
        var dayNames = [];
        var $tooltip;
        var hideTimeout = null;
        var fadingIn = false;
        var fadingOut = false;
        var fadedIn = false;

        function createTooltip () {
            $tooltip = $('<div class="flot-graph-tooltip"/>')
            .css({
                'position': 'absolute',
                'padding': '0.4em 0.6em',
                'border-radius': '0.5em',
                'border': '1px solid #111',
                'background-color': '#fff',
                'display': 'none',
                'white-space': 'nowrap'
            });
            // position under the drag/zoom overlay div
            plot.getPlaceholder().find('.flot-base').after($tooltip);
        }

        function showTooltip (x, y, datapoint) {
            //var formatted = (new Date(datapoint[0])).toString();
            var d = $.plot.dateGenerator(datapoint[0], plot.getXAxes()[0].options);
            var formatted = $.plot.formatDate(d, '%d %b %Y %H:%M:%S', monthNames, dayNames);

            // stop the hiding timeout if one is active
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }

            // update text
            var datapoint_fmt = datapoint[1].toFixed(3);
            $tooltip.text(datapoint_fmt + ' (' + formatted + ')');

            // its not positioned in the graph div, so subtract the parent's document offset
            var refpos = plot.getPlaceholder().offset();
            x -= refpos.left;
            y -= refpos.top;

            // reposition instantly (animation code remove due to slowness)
            $tooltip.css({
                'top': y - 25,
                'left': x + 5
            });

            // fade in if invisible
            if (!fadedIn) {
                if (!fadingIn) {
                    fadingOut = false;
                    fadingIn = true;
                    $tooltip.fadeIn(200, function () {
                        fadingIn = false;
                        fadedIn = true;
                    });
                }
            }
        }

        function hideTooltip () {
            if (hideTimeout == null) {
                hideTimeout = setTimeout(function () {
                    if (fadedIn) {
                        fadingIn = false;
                        fadingOut = true;
                        fadedIn = false;
                        $tooltip.fadeOut(200, function () {
                            fadingOut = false;
                        });
                    }
                    hideTimeout = null;
                }, 1000);
            }
        }

        function plothover (event, pos, item) {
            if (item) {
                showTooltip(item.pageX, item.pageY, item.datapoint);
            }
            else {
                hideTooltip();
            }
        }

        function bindEvents(plot, eventHolder) {
            createTooltip();

            // bind to plothover
            plot.getPlaceholder().bind("plothover", plothover);
        } // bindEvents

        function shutdown(plot, eventHolder) {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            if ($tooltip) {
                $tooltip.remove();
            }
            plot.getPlaceholder().unbind("plothover", plothover);
        }

        function processOptions(plot, options) {
            if (!options.tooltip || !options.tooltip.enabled) {
                // only do something when touch options are set
                return;
            }

            monthNames = options.tooltip.monthNames;
            dayNames = options.tooltip.dayNames;

            plot.hooks.bindEvents.push(bindEvents);
            plot.hooks.shutdown.push(shutdown);
        }

        plot.hooks.processOptions.push(processOptions);
	}

	$.plot.plugins.push({
		init: init,
		options: options,
		name: 'tooltip',
		version: '1.0-nens'
	});
})(jQuery);
