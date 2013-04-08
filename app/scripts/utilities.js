// Prevent console.log from throwing errors
if(typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}


$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

$('input[type=checkbox]').live('click', function(e) {
  var el = $(this);
  if(el.is(':checked')) {
    el.parent().css('font-weight', 'bold');
  } else {
    el.parent().css('font-weight', 'normal');
  }
  return true;
});


$('.VS-interface').live('focus', function(){
    console.log('hs');
});


// Click handlers for toggling the filter/location/parameter UI
$('li.metrics-dropdown').live("click", function(e){
  e.preventDefault();
  $(this).find('.icon-chevron-down').toggleClass('chevron-oneeighty');
  var el = $(this).next();
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});

$('#extramaplayers-button').live("click", function(e){
    e.preventDefault();
    $('#extramodal').modal();
});

Lizard.Utils = {};

Lizard.Utils.Favorites = {
  toggleSelected: function (model){
    uuid = model.url.split("eries/")[1].split("/")[0];
    if (favoriteCollection.where({timeserie: uuid}).length === 0){
            name = model.attributes.name;
            var favorite = favoriteCollection.create({
              data: {
                location: model.attributes.location,
                timeserie: uuid,
                name: name
            }
            });
            // favoriteCollection.add(favorite);
    }
    else {
      favorite = favoriteCollection.where({timeserie: uuid})[0];
      favorite.destroy({wait:true});
    }
  }
};

Lizard.Utils.DragDrop = {
  drag: function (e){
    sendThis = e.target.dataset.uuid;
    e.dataTransfer.setData("Text", sendThis);
    console.log(e.target);
  },
  allowDrop: function (e){
    e.preventDefault();
  },
  wmsdrop: function (e){
    e.preventDefault();
    var wms_layer= e.dataTransfer.getData("Text");
    var $target = $(e.target);
  },
  drop: function (e){
    e.preventDefault();
    var data_url = e.dataTransfer.getData("Text");
    var $target = $(e.target);
    $target.parent().removeClass("empty");
    // only fire for nearest .graph-drop parent (in case there is already a graph in the element)
    var $graph = $target;
    if (!$graph.hasClass('graph-drop')) {
        $graph = $target.parent('.graph-drop');
    }
    $graph.loadPlotData(data_url);
  }
};

/**
 * Code related to initializing jQuery Flot.
 */
(function (global) {

/**
 * Detect IE version, so we can make some exceptions,
 * due to this browsers crappiness.
 */
var isIE = false;
var ieVersion = 0;
(function () {
    if (navigator.appName == 'Microsoft Internet Explorer') {
        isIE = true;
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            var rv = parseFloat(RegExp.$1);
            ieVersion = rv;
        }
    }
}());

/**
 * Detect Apple appliances.
 */
var isAppleMobile = false;
(function () {
    if (navigator && navigator.userAgent && navigator.userAgent != null) {
        var strUserAgent = navigator.userAgent.toLowerCase();
        var arrMatches = strUserAgent.match(/(iphone|ipod|ipad)/);
        if (arrMatches)
            isAppleMobile = true;
    }
}());


/**
 * Things related to time/date formatting.
 */
var timeUnitSize = {
    "second": 1000,
    "minute": 60 * 1000,
    "hour": 60 * 60 * 1000,
    "day": 24 * 60 * 60 * 1000,
    "month": 30 * 24 * 60 * 60 * 1000,
    "quarter": 3 * 30 * 24 * 60 * 60 * 1000,
    "year": 365.2425 * 24 * 60 * 60 * 1000
};
var dayNames = ['zo', 'ma', 'di', 'wo', 'do', 'vr','za'];
var monthNames = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
function timeTickFormatter (v, axis, tickIndex, tickLength) {
    var d = $.plot.dateGenerator(v, axis.options);

    // note: first tick is tickIndex 1, but only sometimes (???)
    var isFirstOrLast = tickIndex === 1 || tickIndex === (tickLength - 2);

    var t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]];
    var span = axis.max - axis.min;
    var suffix = (isFirstOrLast) ? " %p" : "";
    var fmt;

    if (t < timeUnitSize.minute) {
        if (isFirstOrLast) {
            fmt = "%H:%M:%S\n%d %b";
        }
        else {
            fmt = "%H:%M:%S";
        }
    }
    else if (t < timeUnitSize.day) {
        if (span < 2 * timeUnitSize.day) {
            if (isFirstOrLast) {
                fmt = "%H:%M\n%d %b";
            }
            else {
                fmt = "%H:%M";
            }
        }
        else {
            fmt = "%H:%M\n%d %b";
        }
    }
    else if (t < timeUnitSize.month) {
        fmt = "%d\n%b";
    }
    else if (t < timeUnitSize.year) {
        if (span < timeUnitSize.year) {
            if (isFirstOrLast) {
                fmt = "%b\n%Y";
            }
            else {
                fmt = "%b";
            }
        }
        else {
            fmt = "%b\n%Y";
        }
    }
    else {
        fmt = "%Y";
    }

    var rt = $.plot.formatDate(d, fmt, monthNames, dayNames);

    return rt;
}

/**
 * Initializes a Flot plot on element $graph, and load point data from
 * dataUrl. If $graph already contains a plot, simple adds the data
 * from dataUrl as a second line in the plot.
 */
function loadPlotData ($graph, dataUrl, callback, force) {
    // no dataUrl or element, nothing to do
    if (!$graph || !dataUrl) {
        return;
    }

    // check if element is visible
    // flot can't draw on an invisible surface
    if ($graph.is(':hidden')) {
        return;
    }

    // ensure relative positioning, add a class name, force explicit height/width
    $graph.css({
        'position': 'relative',
        'width': '100%',
        'height': '100%'
    });
    $graph.addClass('flot-graph');
    if ($graph.height() === 0) {
        console.error('Height of the graph element seems to be 0');
    }

    // initialize the graph, if it doesn't exist already
    var plot = $graph.data('plot');
    if (!plot) {
        plot = initializePlot($graph);
        $graph.data('plot', plot);
    }

    plot.addDataUrl(dataUrl);
}

/**
 * Allow graphs to be loaded on any HTML element. This essentially
 * describes the "API" for all your plotting needs.
 */
$.fn.loadPlotData = function (dataUrl, callback, force) {
    if (typeof dataUrl === 'undefined') {
        // get the data url from the element instead
        var dataUrl = $(this).data('data-url');
    }
    loadPlotData($(this), dataUrl, callback, force);
};

/**
 * Initialize an empty jQuery Flot plot on passed element.
 */
function initializePlot($container) {
    // define a set of sane options used for all graphs
    var defaultOpts = {
        series: {
            points: { show: true, hoverable: true, radius: 1 },
            shadowSize: 0,
            lines: { show: true }
        },
        yaxes: [
            // allocate at least five axes, but don't reserve space
            // for the last three
            {
                axisLabel: '',
                zoomRange: [false, false],
                panRange: false,
                position: 'left',
                reserveSpace: true
            },
            {
                axisLabel: '',
                zoomRange: [false, false],
                panRange: false,
                position: 'right',
                reserveSpace: true
            },
            {
                axisLabel: '',
                zoomRange: [false, false],
                panRange: false,
                position: 'right',
                reserveSpace: false
            },
            {
                axisLabel: '',
                zoomRange: [false, false],
                panRange: false,
                position: 'right',
                reserveSpace: false
            },
            {
                axisLabel: '',
                zoomRange: [false, false],
                panRange: false,
                position: 'right',
                reserveSpace: false
            }
        ],
        xaxes: [
            {
                axisLabel: 'Tijd',
                timezone: 'browser',
                mode: 'time',
                zoomRange: [1 * timeUnitSize.minute, 400 * timeUnitSize.year],
                tickFormatter: timeTickFormatter,
                labelHeight: 28 // always reserve enough vertical space for the time label
            }
        ],
        grid: {
            hoverable: true,
            labelMargin: 4,
            margin: 30 /* for the axis labels */,
            borderWidth: 1,
            autoHighlight: false
        },
        legend: {
            show: false
        }
    };

    // update the default options based on the users platform
    if (isAppleMobile) {
        $.extend(defaultOpts, {
            // enable touch
            touch: { pan: 'xy', scale: 'x', autoWidth: false, autoHeight: false },
            // disable flot.navigate pan & zoom
            pan: { interactive: false },
            zoom: { interactive: false },
            // no mouseover stuff on iPad
            legendonmouseover: {
                enabled: false
            }
        });
    }
    else {
        $.extend(defaultOpts, {
            // disable touch, so the flot.touch plugin won't mess up the desktop browser
            touch: false,
            // enable pan & zoom
            pan: { interactive: false },
            zoom: { interactive: true },
            // enable a mouse tooltip
            tooltip: {
                enabled: true,
                monthNames: monthNames,
                dayNames: dayNames
            },
            // enable buttons for zoom / pan
            zoombuttons: {
                enabled: true
            },
            // draw the legend only when hovering above plot
            legendonmouseover: {
                enabled: true
            }
        });
    }

    // initialize an empty Flot plot
    var finalOpts = $.extend({}, defaultOpts);
    var plot = $.plot($container, [], finalOpts);

    // make sure all plots on the document scroll in synch with this plot
    bindPanZoomEvents($container);

    return plot;
}

/**
* Bind several flot graphs together. When navigating through one graph, the other graphs
* should follow the zoom levels, and extent.
*/
function panAndZoomOtherGraphs(plot) {
    var axes = plot.getAxes();
    var xmin = axes.xaxis.min;
    var xmax = axes.xaxis.max;
    $('.flot-graph').each(function () {
        if ($(this).is(':visible')) {
            var otherPlot = $(this).data('plot');
            if (otherPlot && plot !== otherPlot) {
                var otherXAxis = otherPlot.getAxes().xaxis;
                var otherXAxisOptions = otherXAxis.options;
                otherXAxisOptions.min = xmin;
                otherXAxisOptions.max = xmax;
                otherPlot.setupGrid();
                otherPlot.draw();
                otherPlot.getPlaceholder().trigger('axisminmaxchanged', otherXAxis);
            }
        }
    });
}

function bindPanZoomEvents($graph) {
    $graph.bind('plotzoom', function (event, plot) {
        panAndZoomOtherGraphs(plot);
    });

    $graph.bind('plotpan', function (event, plot) {
        panAndZoomOtherGraphs(plot);
    });
}

/**
 * Turn mouse cursor in a spinner on Ajax requests.
 */
$(document).ajaxStart(function () {
    $('html').addClass('busy');
});

$(document).ajaxStop(function () {
    $('html').removeClass('busy');
});

}(this));
