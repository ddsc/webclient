(function($) {
    var options = {
        legendonmouseover: {
            enabled: false
        }
    };

	function init(plot) {
        function mouseover (event) {
            plot.getOptions()['legend']['show'] = true;
            plot.draw();
        }

        function mouseout (event) {
            plot.getOptions()['legend']['show'] = false;
            plot.draw();
        }

        function bindEvents(plot, eventHolder) {
            // bind to mouseover
            plot.getPlaceholder().on('mouseover', mouseover);
            plot.getPlaceholder().on('mouseout', mouseout);
        } // bindEvents

        function shutdown(plot, eventHolder) {
            plot.getPlaceholder().off('mouseover', mouseover);
            plot.getPlaceholder().off('mouseout', mouseout);
        }

        function processOptions(plot, options) {
            if (!options.legendonmouseover || !options.legendonmouseover.enabled) {
                // only do something when legendonmouseover options are set
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
		name: 'legendonmouseover',
		version: '1.0-nens'
	});
})(jQuery);
