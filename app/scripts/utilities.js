// Prevent console.log from throwing errors
if(typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

$(window).on('resize', function(e) {
    if ($(window).width() < 768) {
        $('.graph-and-legend .legend').css('height', '100px');
    } else {
        $('.graph-and-legend .legend').css('height', '300px');
    }
});


$('#startTour').on('click', function() {
    tour.start(true);
});

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


window.toggleFullScreen = function () {
    if (window.mapFullScreen) {
        // full screen -> normal screen
        $('#sidebar').css('display', 'initial');
        var fullScreenMap = document.getElementById('full-screen-map');
        fullScreenMap.parentNode.removeChild(fullScreenMap); //remove()
        var locationSearch = document.getElementById('geocoderRegion');
        locationSearch.style.cssText = "";

        // Is a different styling needed in normal mode?
        //var header = document.getElementById('header');
        //header.classList.remove('fullscreen');

        Lizard.mapView.fullScreenRegion.close();
        var lonlatzoom = window.location.hash.split('#map/')[1];
        if (lonlatzoom && lonlatzoom !== 'alarm' &&
            lonlatzoom !== 'status') {
            lonlatzoom = lonlatzoom.split(',');
        } else {
            lonlatzoom = '5.16082763671875,51.95442214470791,7'.split(','); 
        }
        var leafletView = new Lizard.Views.Map({
            lon: lonlatzoom[0],
            lat: lonlatzoom[1],
            zoom: lonlatzoom[2],
            workspace: Lizard.workspaceView.getCollection()
          });

         Lizard.mapView.leafletRegion.show(leafletView.render()); 
         Lizard.Map.ddsc_layers = new Lizard.geo.Layers.DdscMarkerLayer({
            collection: locationCollection,
            map: leafletView
          });
    } else {
        // normal screen -> full screen

        // Do not display the sidebar in full-screen mode. On small screens,
        // the sidebar will show up when scrolling, which is rather ugly.
        // NB: scrolling is needed to have access to search results, so
        // we can't use 'overflow: hidden'.
        $('#sidebar').css('display', 'none');

        var fullScreenMap = document.getElementById('full-screen-map');
        if (fullScreenMap === null) {
            fullScreenMap = document.createElement('div');
            fullScreenMap.id = 'full-screen-map';
            var container = document.getElementById('content').parentNode;
            container.parentNode.insertBefore(fullScreenMap, container);
        }

        // Is a different styling needed in full-screen mode?
        //var header = document.getElementById('header');
        //header.classList.add('fullscreen');
        fullScreenMap.style.cssText = "position: absolute; width: 100%; height: calc(100% - 40px); top: 40px;";
        var locationSearch = document.getElementById('geocoderRegion');
        locationSearch.style.cssText = "margin-top: calc(75%);"
        Lizard.mapView.leafletRegion.close()
        var lonlatzoom = window.location.hash.split('#map/')[1];
        console.log('lonlatzoom', lonlatzoom)
        if (lonlatzoom && lonlatzoom !== 'alarm' &&
            lonlatzoom !== 'status') {
            lonlatzoom = lonlatzoom.split(',');
        } else {
            lonlatzoom = '5.16082763671875,51.95442214470791,7'.split(','); 
        }
        var leafletView = new Lizard.Views.Map({
            lon: lonlatzoom[0],
            lat: lonlatzoom[1],
            zoom: lonlatzoom[2],
            workspace: Lizard.workspaceView.getCollection(),
            container: 'full-screen-map'
          });

        fullScreenMap.style.zIndex = "1000";
        Lizard.mapView.fullScreenRegion.show(leafletView.render());
        Lizard.Map.ddsc_layers = new Lizard.geo.Layers.DdscMarkerLayer({
            collection: locationCollection,
            map: leafletView
        });
    }
    var annotationsModelInstance = new Lizard.Models.Annotations();
    var annotationsView = new Lizard.Views.AnnotationsView({
        model: annotationsModelInstance,
        mapView: leafletView
    });
    Lizard.mapView.annotationsRegion.show(annotationsView.render());
    Lizard.App.vent.trigger('mapLoaded');

    window.mapFullScreen = !window.mapFullScreen;

};

Lizard.Utils = {};

Lizard.Utils.Favorites = {
  toggleSelected: function (model){
    uuid = model.url.split("eries/")[1].split("/")[0];
    if (favoriteCollection.where({timeserie: uuid}).length === 0){
            var favorite = favoriteCollection.create({
              data: {
                location: model.attributes.location,
                timeserie: uuid,
                name: model.attributes.name
            }
            });
            // favoriteCollection.add(favorite);
    }
    else {
      var favorite = favoriteCollection.where({timeserie: uuid})[0];
      favorite.destroy({wait:true});
    }
  }
};

Lizard.Utils.DragDrop = {
  copyData: function (e){
    $('.graph').addClass('stitched'); // add stitch border
    var data = $(e.target).data();
    var sendThis = JSON.stringify(data);
    if (e.originalEvent) {
        e.originalEvent.dataTransfer.setData("Text", sendThis);
    }
    else {
        e.dataTransfer.setData("Text", sendThis);
    }
    console.log('setting dataTransfer = ' + sendThis);
  },
  allowDrop: function (e){
    e.preventDefault();
  },
  wmsdrop: function (e){
    e.preventDefault();
    var wms_layer= e.dataTransfer.getData("Text");
    var $target = $(e.target);
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
var monthNames = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
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
 * Initialize an empty jQuery Flot plot on passed element.
 */
function initializePlot($container, options) {
    // define a set of sane options used for all graphs
    if (options && options.scatterplot) {
        var defaultOpts = {
            series: {
                points: { show: true, hoverable: true, radius: 1 },
                shadowSize: 0,
                lines: { show: false }
            },
            yaxes: [
                {
                    axisLabel: '',
                    zoomRange: false,
                    panRange: false,
                    position: 'left',
                    reserveSpace: true
                },
                {
                    axisLabel: '',
                    zoomRange: false,
                    panRange: false,
                    position: 'right',
                    reserveSpace: true
                }
            ],
            xaxes: [
                {
                    axisLabel: '',
                    zoomRange: false,
                    panRange: false
                },
                {
                    axisLabel: '',
                    zoomRange: false,
                    panRange: false
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
            },
            scatterplot: {
                enabled: true
            }
        };
    }
    else {
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
    }

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
            pan: { interactive: true },
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
            }
        });
    }

    // initialize an empty Flot plot
    var finalOpts = $.extend({}, defaultOpts);
    var plot = $.plot($container, [], finalOpts);

    if (!options || !options.scatterplot) {
        // make sure all plots on the document scroll in synch with this plot
        //bindPanZoomEvents($container);
    }

    return plot;
}

$.fn.initializePlot = function (options) {
    return initializePlot(this, options);
};

/**
* Bind several flot graphs together. When navigating through one graph, the other graphs
* should follow the zoom levels, and extent.
*/
function panAndZoomOtherGraphs(plot) {
    var axes = plot.getAxes();
    var xmin = axes.xaxis.min;
    var xmax = axes.xaxis.max;
    $('.graph').each(function () {
        if ($(this).is(':visible')) {
            var otherPlot = $(this).data('plot');
            if (otherPlot && plot !== otherPlot) {
                var otherXAxis = otherPlot.getAxes().xaxis;
                var otherXAxisOptions = otherXAxis.options;
                if (otherXAxisOptions.mode == 'time') {
                    otherXAxisOptions.min = xmin;
                    otherXAxisOptions.max = xmax;
                    otherPlot.setupGrid();
                    otherPlot.draw();
                    otherPlot.getPlaceholder().trigger('axisminmaxchanged', otherXAxis);
                }
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

$(document).ajaxStart(function () {
    $('html').addClass('busy');
});

$(document).ajaxStop(function () {
    $('html').removeClass('busy');
});
*/

$(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
    // Aborted request are not an error.
    if (thrownError !== 'abort') {
        $('.top-right').notify({
            type: 'error',
            message: {
                text: 'Er gaat iets fout, namelijk: ' + thrownError
            }
        }).show();
    }
});

}(this));


function truncateString (string, limit, breakChar, rightPad) {
    if (string.length <= limit) return string;

    var substr = string.substr(0, limit);
    if ((breakPoint = substr.lastIndexOf(breakChar)) >= 0) {
        if (breakPoint <= string.length -1) {
            return string.substr(0, breakPoint) + rightPad;
        }
    }
    return string;
}
