(function($) {
    var options = {
        zoombuttons: {
            enabled: false
        }
    };

	function init(plot) {
        var monthNames = [];
        var dayNames = [];
        var $buttons;
        var fadingIn = false;
        var fadingOut = false;
        var fadedIn = false;
        var moving = false;

        function createButtons () {
            $buttons = $('<div class="flot-zoom-buttons btn-group" />')
            .css({
                'display': 'none',
                'position': 'absolute',
                'left': '50%',
                'top': 0,
                'width': 140,
                'margin-left': -70
            });
            var $trash = $('<button title="Verwijder data" class="btn btn-mini" type="button"><i class="icon-trash"></i></button>');
            $buttons.append($trash);
            var $reset = $('<button title="Reset zoom" class="btn btn-mini" type="button"><i class="icon-refresh"></i></button>');
            $buttons.append($reset);
            var $plus = $('<button title="Zoom in" class="btn btn-mini" type="button"><i class="icon-zoom-in"></i></button>');
            $buttons.append($plus);
            var $min = $('<button title="Zoom uit" class="btn btn-mini" type="button"><i class="icon-zoom-out"></i></button>');
            $buttons.append($min);
            var $bwd = $('<button title="Schuif naar links" class="btn btn-mini" type="button"><i class="icon-backward"></i></button>');
            $buttons.append($bwd);
            var $fwd = $('<button title="Schuif naar rechts" class="btn btn-mini" type="button"><i class="icon-forward"></i></button>');
            $buttons.append($fwd);

            $trash.click(function () {
                plot.removeAllDataUrls();
            });
            $reset.click(function () {
                plot.setPreventUpdates(true);
                $.each(plot.getXAxes(), function (idx, axis) {
                    if (axis.datamin && axis.datamax) {
                        axis.options.min = null;
                        axis.options.max = null;
                    }
                    else {
                        // can't determine bounds from the data, so just
                        // pick sane ones
                        var today = new Date();
                        var lastYear = new Date(
                            today.getFullYear() - 1,
                            today.getMonth(),
                            today.getDate(),
                            today.getHours(),
                            today.getMinutes(),
                            today.getMilliseconds()
                        );
                        axis.options.min = lastYear.getTime();
                        axis.options.max = today.getTime();
                    }
                });
                $.each(plot.getYAxes(), function (idx, axis) {
                    if (axis.datamin && axis.datamax) {
                        axis.options.min = null;
                        axis.options.max = null;
                    }
                });
                plot.setupGrid();
                plot.draw();
                plot.setPreventUpdates(false);
            });
            $plus.click(function () {
                plot.zoom({ amount: 2 });
            });
            $min.click(function () {
                plot.zoom({ amount: 0.5 });
            });
            $bwd.click(function () {
                plot.pan({ left: -plot.width() / 3 });
            });
            $fwd.click(function () {
                plot.pan({ left: plot.width() / 3 });
            });

            // position under the drag/zoom overlay div
            plot.getPlaceholder().append($buttons);
        }

        function mouseover (event) {
            $buttons.show();
        }

        function mouseout (event) {
            $buttons.hide();
        }

        function bindEvents(plot, eventHolder) {
            createButtons();

            // bind to mouseover
            plot.getPlaceholder().on('mouseover', mouseover);
            plot.getPlaceholder().on('mouseout', mouseout);
        } // bindEvents

        function shutdown(plot, eventHolder) {
            if ($buttons) {
                $buttons.remove();
            }
            plot.getPlaceholder().off('mouseover', mouseover);
            plot.getPlaceholder().off('mouseout', mouseout);
        }

        function processOptions(plot, options) {
            if (!options.zoombuttons || !options.zoombuttons.enabled) {
                // only do something when zoombuttons options are set
                return;
            }

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
