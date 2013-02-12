// Prevent console.log from throwing errors
if(typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

$('input[type=checkbox]').live('click', function(e) {
  var el = $(this);
  if(el.is(':checked')) {
    el.parent().css('background', '#bae483');
    el.parent().css('border-bottom', '1px solid rgba(255, 255, 255, 0.1)');
    el.parent().css('-moz-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
    el.parent().css('-webkit-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
    el.parent().css('box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
    el.parent().css('-webkit-border-radius', '10px');
    el.parent().css('-moz-border-radius', '10px');
    el.parent().css('border-radius', '10px');
  } else {
    el.parent().css('background', 'none');
    el.parent().css('border-bottom', 'none');
    el.parent().css('-moz-box-shadow', 'none');
    el.parent().css('-webkit-box-shadow', 'none');
    el.parent().css('box-shadow', 'none');
    el.parent().css('-webkit-border-radius', 'none');
    el.parent().css('-moz-border-radius', 'none');
    el.parent().css('border-radius', 'none');
  }
  return true;
});


// Click handlers for toggling the filter/location/parameter UI
$('em.toggle').live("click", function(e){
  e.preventDefault();
  var el = $(this).parent().next();
  console.log(el.is(':visible'));
  // console.log(el.is(':visible'));
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});

$('em.reset').live("click", function(e){
  e.preventDefault();
  console.log("Resetting collections");
  _.each(filtercollectionview.collection.models, function(model) {
    model.set('selected', false);
  });
  _.each(locationcollectionview.collection.models, function(model) {
    model.set('selected', false);
  });
  _.each(parametercollectionview.collection.models, function(model) {
    model.set('selected', false);
  });
});

Lizard.Utils = {};

Lizard.Utils.Workspace = {
  queryString: null,
  toggleSelected: function (uuid, type){
    console.log(uuid + type);
    queryString = type + "," + uuid;
    if (workspaceCollection.get(queryString) === undefined){
      tempModel = new Lizard.Models.Location({url: domain + type +'/' + uuid});
      tempModel.fetch({success: this.createItem});
      tempModel.destroy();
    }
    else {
      workspaceItem = workspaceCollection.remove(queryString);
    }
  },
  createItem: function (mod, response){
    workspaceItem = new Lizard.Models.WorkspaceItem({
      id: this.queryString,
      tseries: response.timeseries,
    });
    workspaceCollection.add(workspaceItem);
  return workspaceItem;
  },
};

Lizard.Utils.DragDrop = {
  drag: function (e){
    sendThis = e.target.dataset.url;
    e.dataTransfer.setData("Text", sendThis);
  },

  allowDrop: function (e){
    e.preventDefault();
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
    $graph.loadPlotData(data_url + '?eventsformat=flot');
    // var EventCollection = Backbone.Collection.extend({
          // url: data_url
        // })
        // // Timeserie has Events. Opens new collection
        // // for that specific timeserie.
        // ts_events = new EventCollection()
        // // _.bind connects "this" to the makeChart
        // // otherwise it loses it's scope.
        // ts_events.fetch({async:false, cache: true,
          // success: _.bind(makeChart, e)
    // });
  },
};

function makeChart(collection, responses){
      this.target.className.replace('empty', '')
      ts_events = responses;
      series = [];
      numbers = [];
      code = 'ja'
      for (i in ts_events){
        var date = new Date(ts_events[i].datetime);
        yvalue = parseFloat(ts_events[i].value);
        var value = {x: date.getTime()/1000, y: yvalue};
        (value ? series.push(value) : 'nothing');
        numbers.push(yvalue)
      }
      numbers.sort()
      // Could not find a more elegant solution so far
      // Div needs to be empty, otherwise it stacks
      // many graphs.
      console.log(this);
      $(this.target).empty();
      var graph = new Rickshaw.Graph( {
      element: this.target,
      renderer: 'line',
      min: numbers[0],
      max: numbers[numbers.length - 1],
      series: [
            {
              color: "#c05020",
              data: series,
              name: code
            },
          ]
        } );
      
      var y_ticks = new Rickshaw.Graph.Axis.Y( {
        graph: graph,
        orientation: 'left',
        // tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: $('chart-y-axis')[0],
      } );

      graph.render();
      var hoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph
      } );

      // var legend = new Rickshaw.Graph.Legend( {
      //   graph: graph,
      //   element: $('#legend')[0]

      // } );

      // var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
      //   graph: graph,
      //   legend: legend
      // } );

      var axes = new Rickshaw.Graph.Axis.Time( {
        graph: graph
      } );
      axes.render();

    };

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
 * Configure jQuery.
 */
$.ajaxSetup({
    timeout: 20000,
    crossDomain: true,
    xhrFields: {
       withCredentials: true
    }
});

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

    // note: first tick is tickIndex 1
    var isFirstOrLast = tickIndex == 1 || tickIndex == (tickLength - 2);

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
        fmt = "%d %b";
    }
    else if (t < timeUnitSize.year) {
        if (span < timeUnitSize.year) {
            fmt = "%b";
        }
        else {
            fmt = "%b %Y";
        }
    }
    else {
        fmt = "%Y";
    }

    var rt = $.plot.formatDate(d, fmt, monthNames, dayNames);

    return rt;
}

function loadPlotData ($graph, dataUrl, callback, force) {
    // no dataUrl or element, nothing to do
    if (!$graph || !dataUrl) {
        return;
    }

    // check if data is already loaded
    var loadedDataUrls = $graph.data('loadedDataUrls');
    if (force !== true && loadedDataUrls) {
        $.each(loadedDataUrls, function (idx, loadedDataUrl) {
            if (loadedDataUrl == dataUrl) {
                // data from this URL is already loaded, do nothing
                return;
            }
        });
    }

    // the wonders of asynchronous programming
    // do nothing if data is still loading
    if ($graph.data('isLoading') === true) {
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
    if ($graph.height() == 0) {
        console.error('Height of the graph element seems to be 0');
    }

    // initialize the graph, if it doesn't exist already
    var plot = $graph.data('plot');
    if (!plot) {
        plot = initializePlot($graph);
        $graph.data('plot', plot);
    }

    // add a spinner
    var $loading = $('<span class="loading" />');
    $graph.append($loading);
    $graph.data('isLoading', true);

    // remove spinner when loading has finished (either with or without an error)
    function loadingFinished () {
        $graph.data('isLoading', false);
        $loading.remove();
    }

    // swap out graph for an error icon when we failed to retrieve the data
    function showError () {
        var $broken = $('<span class="broken" />');
        $broken.click(function (event) {
            $broken.remove();
            loadPlotData($graph, dataUrl, callback, true);
        });
        $graph.append($broken);
    }

    // call callback on success
    function loadingSuccess () {
        // update loadedDataUrls
        var loadedDataUrls = $graph.data('loadedDataUrls');
        if (!loadedDataUrls) {
            loadedDataUrls = [];
        }
        loadedDataUrls.push(dataUrl);
        $graph.data('loadedDataUrls', loadedDataUrls);

        // set attribute and call callback when drawing has finished
        if (typeof callback !== 'undefined') {
            callback();
        }
    }

    // for flot graphs, grab the JSON data and call Flot
    $.get(dataUrl, {}, undefined, 'json')
    .done(function (data, textStatus, jqXHR) {
        loadingFinished();

        // target element might have been hidden in the meantime
        // so check if element is visible again:
        // we can't draw on an invisible surface
        if ($graph.is(':hidden')) {
            return;
        }

        // add the data
        $.each(data, function (idx, line) {
            addPlotLine(plot, line);
        });
        redraw(plot);
        loadingSuccess();
        // try {
        // }
        // catch (Exception) {
            // // we probably recieved some malformed data
            // showError();
        // }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        loadingFinished();
        showError();
    });
}

$.fn.loadPlotData = function (dataUrl, callback, force) {
    if (typeof dataUrl === 'undefined') {
        // get the data url from the element instead
        var dataUrl = $(this).data('data-url');
    }
    loadPlotData($(this), dataUrl, callback, force);
};

function redraw (plot) {
    plot.setupGrid();
    plot.draw();
    plot.triggerRedrawOverlay();
}

function addPlotLine (plot, line) {
    var currentData = plot.getData();
    var newData = $.extend(true, [], currentData);
    var parameter_pk_to_yaxis = {};
    var allocated_yaxes = 0;

    // unset old colors so Flot determines a new color from the default colormap
    $.each(newData, function (idx, line) {
        delete line['color'];
    });

    // determine yaxis per parameter
    var yAxes = plot.getYAxes();
    $.each(yAxes, function (idx, axis) {
        if ('parameter_pk' in axis) {
            parameter_pk_to_yaxis[axis.parameter_pk] = axis.n;
            allocated_yaxes++; // can't properly get the length of an associative array
        }
    });

    // add the new data
    // create a new axis only when we discover a new parameter
    var yaxis = 0;
    if (line.parameter_pk in parameter_pk_to_yaxis) {
        yaxis = parameter_pk_to_yaxis[line.parameter_pk];
    }
    else {
        // allocate a new axis
        yaxis = allocated_yaxes + 1;
        // set the axisLabel and parameter
        yAxes[yaxis].parameter_pk = line.parameter_pk;
        yAxes[yaxis].axisLabel = line.parameter_name;
    }
    line.yaxis = yaxis;
    newData.push(line);

    plot.setData(newData);
}

function initializePlot($container) {
    // define a set of options used for all graphs
    var defaultOpts = {
        series: {
            points: { show: true, hoverable: true, radius: 1 },
            shadowSize: 0,
            lines: { show: true }
        },
        yaxes: [
            // allocate at least 5 axes
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
                mode: 'time',
                zoomRange: [1 * timeUnitSize['minute'], 400 * timeUnitSize['year']],
                tickFormatter: timeTickFormatter,
                labelHeight: 28 // always reserve enough vertical space for time label
            }
        ],
        grid: { hoverable: true, labelMargin: 4, margin: 30 /* for the axis labels */, borderWidth: 1}
    };

    if (isAppleMobile) {
        $.extend(defaultOpts, {
            // enable touch
            touch: { pan: 'xy', scale: 'x', autoWidth: false, autoHeight: false },
            // disable flot.navigate pan & zoom
            pan: { interactive: false },
            zoom: { interactive: false }
        });
    }
    else {
        $.extend(defaultOpts, {
            // disable touch, so the flot.touch plugin won't mess up the desktop browser
            touch: false,
            // enable pan & zoom
            pan: { interactive: false },
            zoom: { interactive: true },
            tooltip: {
                enabled: true,
                monthNames: monthNames,
                dayNames: dayNames
            },
            zoombuttons: {
                enabled: true
            }
        });
    }

    var finalOpts = $.extend({}, defaultOpts);
    var plot = $.plot($container, [], finalOpts);

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
                var otherXAxisOptions = otherPlot.getAxes().xaxis.options;
                otherXAxisOptions.min = xmin;
                otherXAxisOptions.max = xmax;
                otherPlot.setupGrid();
                otherPlot.draw();
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

}(this));