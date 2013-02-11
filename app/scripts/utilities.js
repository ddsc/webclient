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
      tseries: response.timeseries
    })
    Lizard.Graphs.Workspace.add(workspaceItem);
  return workspaceItem
  },
}

Lizard.Utils.DragDrop = {
  drag: function (e){
  timeserie = new Lizard.models.Timeserie({url: e.target.dataset.url});
  timeserie.fetch({async: false});
  sendThis = timeserie.attributes.events;
  e.dataTransfer.setData("Text", sendThis);

   },

  allowDrop: function (e){
    e.preventDefault();
  },

  drop: function (e){
    e.preventDefault();
    var data_url = e.dataTransfer.getData("Text");
    var EventCollection = Backbone.Collection.extend({
          url: data_url
        })
        // Timeserie has Events. Opens new collection
        // for that specific timeserie.
        ts_events = new EventCollection()
        // _.bind connects "this" to the makeChart
        // otherwise it loses it's scope.
        ts_events.fetch({async:false, cache: true,
          success: _.bind(makeChart, e)
        });
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
  var EventCollection = Backbone.Collection.extend({
        url: data_url
      })
      // Timeserie has Events. Opens new collection
      // for that specific timeserie.
      ts_events = new EventCollection()
      // _.bind connects "this" to the makeChart
      // otherwise it loses it's scope.
      ts_events.fetch({async:false, cache: true,
        success: _.bind(makeChart, e)
      });
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