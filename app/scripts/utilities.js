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
  console.log("Resetting collections")
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
    console.log(uuid + type)
    queryString = type + "," + uuid;
    if (Lizard.Graphs.Workspace.get(queryString) === undefined){
      tempModel = new Lizard.models.Location({url: domain + type +'/' + uuid});
      tempModel.fetch({success: this.createItem});
      tempModel.destroy();
    }
    else {
      workspaceItem = Lizard.Graphs.Workspace.remove(queryString);
    }
  },
  createItem: function (mod, response){
    workspaceItem = new Lizard.models.WorkspaceItem({
      id: this.queryString,
      tseries: response.timeseries,
    })
    Lizard.Graphs.Workspace.add(workspaceItem);
  return workspaceItem
  },
}

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
    // var data_url = e.dataTransfer.getData("Text");
    e.target.parentElement.classList.remove("empty");
    $(e.target).loadGraph("scripts/dummy.json");
    // var EventCollection = Backbone.Collection.extend({
    //       url: data_url
    //     })
    //     // Timeserie has Events. Opens new collection
    //     // for that specific timeserie.
    //     ts_events = new EventCollection()
    //     // _.bind connects "this" to the makeChart
    //     // otherwise it loses it's scope.
    //     ts_events.fetch({async:false, cache: true,
    //       success: _.bind(makeChart, e)
    //     });
  },
};
function drag(e){
  timeserie = new Lizard.models.Timeserie({url: e.target.dataset.url});
  timeserie.fetch({async: false});
  sendThis = timeserie.attributes.events;
  e.dataTransfer.setData("Text", sendThis);

 }

function allowDrop(e){
  e.preventDefault();
}

function drop(e){
  e.preventDefault();
  var data_url = e.dataTransfer.getData("Text");
  $(e.target).loadGraph("/scripts/dummy.json");



  // var EventCollection = Backbone.Collection.extend({
  //       url: data_url
  //     })
  //     // Timeserie has Events. Opens new collection
  //     // for that specific timeserie.
  //     ts_events = new EventCollection()
  //     // _.bind connects "this" to the makeChart
  //     // otherwise it loses it's scope.
  //     ts_events.fetch({async:false, cache: true,
  //       success: _.bind(makeChart, e)
  //     });
}

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
    timeout: 20000
});

function loadGraph ($graph, dataUrl, callback, force) {
    // check if graph is already loaded
    if (force !== true && $graph.data('loaded') === true) {
        return;
    }

    // the wonders of asynchronous programming
    if ($graph.data('loading') === true) {
        return;
    }

    // check if element is visible
    // flot can't draw on an invisible surface
    if ($graph.is(':hidden')) {
        return;
    }

    // no data, nothing to do
    if (!dataUrl) {
        return;
    }

    // ensure relative positioning
    $graph.css('position', 'relative');

    // add a spinner
    var $loading = $('<span class="loading" />');
    $graph.empty().append($loading);
    $graph.data('loading', true);

    // remove spinner when loading has finished (either with or without an error)
    function removeSpinner () {
        $graph.data('loading', false);
        $loading.remove();
    }

    // swap out graph for an error icon when we failed to retrieve the data
    function showError () {
        var $broken = $('<span class="broken" />');
        $broken.click(function (event) {
            loadGraph($graph, dataUrl, callback, true);
        });
        $graph.empty().append($broken);
    }

    // for flot graphs, grab the JSON data and call Flot
    $.get(dataUrl, {}, undefined, 'json')
    .done(function (data, textStatus, jqXHR) {
        removeSpinner();

        // target element might have been hidden in the meantime
        // so check if element is visible again:
        // we can't draw on an invisible surface
        if ($graph.is(':hidden')) {
            return;
        }

        // show an error on an empty dataset
        if (!data.data || data.data.length == 0) {
            showError();
        }

        // perform the draw
        var plot = drawGraph($graph, data);
        if (plot) {
            $graph.data('loaded', true);
            // set attribute and call callback when drawing has finished
            if (typeof callback !== 'undefined') {
                callback(plot);
            }
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        removeSpinner();
        showError();
    });
}

$.fn.loadGraph = function (dataUrl, callback, force) {
    if (typeof dataUrl === 'undefined') {
        // get the data url from the element instead
        var dataUrl = $(this).data('data-url');
    }
    loadGraph($(this), dataUrl, callback, force);
};

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

/**
 * Draw the response data to a canvas in DOM element $graph using Flot.
 *
 * @param {$graph} DOM element which will be replaced by the graph
 * @param {response} a dictionary containing graph data such as x/y values and labels
 */
function drawGraph($container, response) {
    // define a set of options used for all graphs
    var defaultOpts = {
        series: {
            points: { show: true, hoverable: true, radius: 1 },
            shadowSize: 0
        },
        yaxes: [
            {
                zoomRange: [false, false],
                panRange: false,
                position: 'left',
                reserveSpace: true
            },
            {
                zoomRange: [false, false],
                panRange: false,
                position: 'right',
                reserveSpace: true
            }
        ],
        xaxes: [
            {
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
            pan: { interactive: true },
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

    // set up elements nested in our assigned parent div
    $container.css('position', 'relative');

    // initial plot
    var opts = {
        xaxes: [
            {
                axisLabel: response.x_label || 'Tijd'
            }
        ],
        yaxes: [
            {
                axisLabel: response.y_label
            },
            {
                axisLabel: response.y2_label || ''
            }
        ]
    };
    var finalOpts = $.extend(true, {}, defaultOpts, opts);
    var plot = $.plot($container, response.data, finalOpts);

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
$(document).ready(function (event) {
    $('#chart').loadGraph('http://demo.lizard.net/fewsunblobbed/map/adapter/adapter_fewsjdbc/flot_graph_data/?adapter_layer_json={%22slug%22:%20%22hhnk%22,%20%22filter%22:%20%22HHNK_OPP_WEB_BOEZEM%22,%20%22parameter%22:%20%22H.meting.boezem%22}&identifier={%22location%22:%20%22KDU-B-848_Gz%22}&identifier={%22location%22:%20%22KDU-B-848_Prmr%22}&identifier={%22location%22:%20%22KGM-Q-20390_uit%22}&dt_start=2013-02-04T00%3A00%3A00%2B00%3A00&dt_end=2013-02-06T00%3A00%3A00%2B00%3A00');
    $('#graph2').loadGraph('http://demo.lizard.net/fewsunblobbed/map/adapter/adapter_fewsjdbc/flot_graph_data/?adapter_layer_json={%22slug%22:%20%22hhnk%22,%20%22filter%22:%20%22HHNK_OPP_WEB_BOEZEM%22,%20%22parameter%22:%20%22H.meting.boezem%22}&identifier={%22location%22:%20%22KDU-B-848_Gz%22}&identifier={%22location%22:%20%22KDU-B-848_Prmr%22}&identifier={%22location%22:%20%22KGM-Q-20390_uit%22}&dt_start=2013-02-04T00%3A00%3A00%2B00%3A00&dt_end=2013-02-06T00%3A00%3A00%2B00%3A00');
});

}(this));