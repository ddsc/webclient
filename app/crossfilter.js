var timeseries = [];

var xhr = d3.json('http://test.api.dijkdata.nl/api/v0/timeseries/?page_size=0')
  .on("progress", function() { console.log("progress", d3.event.loaded); })
  .on("error", function(error) { console.log("failure!", error); })
  .on("load", function(json) {
    json.forEach(function(timeserie) {
      var obj = {};
      obj.name = timeserie.name;
      obj.url = timeserie.events;
      timeseries.push(obj);
    });

    toplist = d3.select("body").append("ul");
    toplist.selectAll("li")
        .data(timeseries)
        .enter()
        .append("li")
        .append("a")
        .attr("href", function(d) {return d.url;})
        .text(function(d){return d.name;});
  }).get();













// var dataset = [];

// var xhr = d3.json('http://test.api.dijkdata.nl/api/v0/timeseries/?page_size=0')
//     .on("progress", function() { console.log("progress", d3.event.loaded); })
//     .on("error", function(error) { console.log("failure!", error); })
//     .on("load", function(json) {

//       var q = queue(4); // Let's load 4 at a time.

//       json.forEach(function(event) { // For every entry in the json...
//         q.defer(d3.json, event.events); // ...load more json using defer()
//       });

//       q.awaitAll(function(e, output) { // Wait for all deferred d3.json's to finish!
//         console.log(output);
//       });

//     })
//     .get(); // Initiate the XHR request using HTTP GET






// function d3json(url) {
//   console.log('d3json');
//   d3.json(url).on('load', function(data) {
//     return data;
//   });
// }

        // var obj = {}; // create object to store name and value array
        // obj.name = event.name; // store name on object
        // obj.values = []; // create empty array on object
        // dataset.push(obj); // push object onto global dataset














// var dataset = [];

// var xhr = d3.json('http://test.api.dijkdata.nl/api/v0/timeseries/')
//     .on("progress", function() { console.log("progress", d3.event.loaded); })
//     .on("error", function(error) { console.log("failure!", error); })
//     .on("load", function(json) {
//       var events = [];
//       var q = queue(2);
//       json.forEach(function(event) { q.defer(, event); });
//       q.awaitAll(function(e, output) {
//         console.log(output);
//       });
//     })
//     .get();




// var q = queue(N);
// input.forEach(function (d) { q.defer(work, d); });
// q.awaitAll(function (e, output) {
//     …
// });




// function createEvent(event) {
//   var xhr = d3.json(event.events)
//       .on("progress", function(d) { console.log("progress", d3.event.loaded); })
//       .on("error", function(error) { console.log("failure!", error); })
//       .on("load", function(timeseries) {
//         updateObject(event.name, timeseries);
//       })
//       .get();
// }

// function updateObject(name, timeseries) {
//   var obj = {}; // create object to store name and value array
//   obj.name = name; // store name on object
//   obj.values = []; // create empty array on object
//   dataset.push(obj); // push object onto global dataset

//   timeseries.forEach(function(t) {
//     obj.values.push({value: t.value, datetime: t.datetime});
//   });
// }






// var dataset = [];

// var xhr = d3.json('http://test.api.dijkdata.nl/api/v0/timeseries/')
//     .on("progress", function() { console.log("progress", d3.event.loaded); })
//     .on("error", function(error) { console.log("failure!", error); })
//     .on("load", function(json) {
//       console.log('Loading ' + json.length + ' timeseries...');
//       json.forEach(function(event) {
//         createEvent(event);
//       });
//     })
//     .get();

// function createEvent(event) {
//   var xhr = d3.json(event.events)
//       .on("progress", function(d) { console.log("progress", d3.event.loaded); })
//       .on("error", function(error) { console.log("failure!", error); })
//       .on("load", function(timeseries) {
//         updateObject(event.name, timeseries);
//       })
//       .get();
// }

// function updateObject(name, timeseries) {
//   var obj = {}; // create object to store name and value array
//   obj.name = name; // store name on object
//   obj.values = []; // create empty array on object
//   dataset.push(obj); // push object onto global dataset

//   timeseries.forEach(function(t) {
//     obj.values.push({value: t.value, datetime: t.datetime});
//   });
// }








// queue(2)
//     .defer(request, "1.json")
//     .defer(request, "2.json")
//     .defer(request, "3.json")
//     .await(ready);


// var dataset = [];
// var xhr = d3.json('http://test.api.dijkdata.nl/api/v0/timeseries/')
//     .on("progress", function() { console.log("progress", d3.event.loaded); })
//     .on("error", function(error) { console.log("failure!", error); })
//     .on("load", function(json) {
//       json.forEach(function(event) {
        
//         var obj = {}; // create object to store name and value array
//         obj.name = event.name; // store name on object
//         obj.values = []; // create empty array on object
//         dataset.push(obj); // push object onto global dataset

//         var xhr = d3.json(event.events)
//             .on("progress", function(d) { console.log("progress", d3.event.loaded); })
//             .on("error", function(error) { console.log("failure!", error); })
//             .on("load", function(data) {
//               data.forEach(function(d) {
//                 obj.values.push({value: d.value, datetime: d.datetime});
//               });
//             })
//             .get();
//       });
//     })
//     .get();













// 
// $(document).ready(function(){

//   d3.json('http://test.api.dijkdata.nl/api/v0/timeseries/', function(timeserie) {
//     timeserie.forEach(function(event) {
//       var obj = {};
//       dataset.push(obj);
//       obj.name = event.name;
//       obj.values = [];
//       d3.json(event.events, function(e) {
//         e.forEach(function(a) {
//           obj.values.push({value: a.value, datetime: a.datetime});
//         });
//       });
//     });
//   });

// });





  //   // d3.json('http://33.33.33.25:3000/api/v1/parameters', function(timeseries) {
  //   d3.json('data/3201_PS1.Q.json', function(timeseries) {
  //     // console.log(timeseries);

  //     timeseries.forEach(function(d, i) {
  //       d.index = i;
  //       d.date = new Date(d.datetime);
  //       d.value = +d.value;
  //     });
      
  //     // Various formatters.
  //     var formatNumber = d3.format(",d"),
  //         formatChange = d3.format("+,d"),
  //         formatDate = d3.time.format("%B %d, %Y"),
  //         formatTime = d3.time.format("%I:%M %p");

  //     // A nest operator, for grouping the flight list.
  //     var nestByDate = d3.nest()
  //         .key(function(d) { return d3.time.day(d.date); });

        
  //       // Apply crossfilter to the timeseries object
  //     var timeserie = crossfilter(timeseries);
  //     console.log(timeserie);

  //     var date = timeserie.dimension(function(d) {
  //       console.log(d3.time.day(d.date));
  //       return d3.time.day(d.date);
  //     });

  //     var dates = date.group();

  //     var hour = timeserie.dimension(function(d) { return d.date.getHours() + d.date.getMinutes() / 60; });
  //     var hours = hour.group(Math.floor);

  //     var value = timeserie.dimension(function(d) { return Math.max(0, Math.min(6000, d.value)); });
  //     var values = value.group(function(d) { return Math.floor(d / 10) * 1; });

  //     var all = timeserie.groupAll();


  //     var charts = [
  //       barChart()
  //           .dimension(hour)
  //           .group(hours)
  //         .x(d3.scale.linear()
  //           .domain([0, 24])
  //           .rangeRound([0, 10 * 24])),

  //       barChart()
  //           .dimension(value)
  //           .group(values)
  //         .x(d3.scale.linear()
  //           .domain([0, 1000])
  //           .rangeRound([0, 10 * 21]))

  //     ];

  //     window.charts = charts;

  //     var chart = d3.selectAll(".chart")
  //       .data(charts)
  //       .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });

  //     var list = d3.selectAll(".list")
  //         .data([valueList]);


  //     renderAll();

  //     function render(method) {
  //       d3.select(this).call(method);
  //     }

  //     // Whenever the brush moves, re-rendering everything.
  //     function renderAll() {
  //       chart.each(render);
  //       list.each(render);
  //       // d3.select("#active").text(formatNumber(all.value()));
  //     }


  //     window.filter = function(filters) {
  //       filters.forEach(function(d, i) { charts[i].filter(d); });
  //       renderAll();
  //     };

  //     window.reset = function(i) {
  //       charts[i].filter(null);
  //       renderAll();
  //     };      


  //     console.log("timeserie:", timeserie);
  //     console.log("dates:", dates);
  //     console.log("hour:", hour);
  //     console.log("hours:", hours);
  //     console.log("value:", value);
  //     console.log("values:", values);
  //     console.log("all:", all);









  // function valueList(div) {
  //   var valuesByDate = nestByDate.entries(date.top(40));

  //   div.each(function() {
  //     var date = d3.select(this).selectAll(".date")
  //         .data(valuesByDate, function(d) { return d.key; });

  //     date.enter().append("div")
  //         .attr("class", "date")
  //       .append("div")
  //         .attr("class", "day")
  //         .text(function(d) { return formatDate(d.values[0].date); });

  //     date.exit().remove();

  //     var flight = date.order().selectAll(".flight")
  //         .data(function(d) { return d.values; }, function(d) { return d.index; });

  //     var flightEnter = flight.enter().append("div")
  //         .attr("class", "flight");

  //     flightEnter.append("div")
  //         .attr("class", "time")
  //         .text(function(d) { return formatTime(d.date); });

  //     flightEnter.append("div")
  //         .attr("class", "origin")
  //         .text(function(d) { return d.origin; });

  //     flightEnter.append("div")
  //         .attr("class", "destination")
  //         .text(function(d) { return d.destination; });

  //     flightEnter.append("div")
  //         .attr("class", "distance")
  //         .text(function(d) { return formatNumber(d.value) + " graden."; });

  //     // flightEnter.append("div")
  //     //     .attr("class", "delay")
  //     //     .classed("early", function(d) { return d.delay < 0; })
  //     //     .text(function(d) { return formatChange(d.delay) + " min."; });

  //     flight.exit().remove();

  //     flight.order();
  //   });
  // }
  //   });





  // function barChart() {
  //   if (!barChart.id) barChart.id = 0;

  //   var margin = {top: 10, right: 10, bottom: 20, left: 10},
  //       x,
  //       y = d3.scale.linear().range([100, 0]),
  //       id = barChart.id++,
  //       axis = d3.svg.axis().orient("bottom"),
  //       brush = d3.svg.brush(),
  //       brushDirty,
  //       dimension,
  //       group,
  //       round;

  //   function chart(div) {
  //     var width = x.range()[1],
  //         height = y.range()[0];

  //     y.domain([0, group.top(1)[0].value]);

  //     div.each(function() {
  //       var div = d3.select(this),
  //           g = div.select("g");

  //       // Create the skeletal chart.
  //       if (g.empty()) {
  //         div.select(".title").append("a")
  //             .attr("href", "javascript:reset(" + id + ")")
  //             .attr("class", "reset")
  //             .text("reset")
  //             .style("display", "none");

  //         g = div.append("svg")
  //             .attr("width", width + margin.left + margin.right)
  //             .attr("height", height + margin.top + margin.bottom)
  //           .append("g")
  //             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //         g.append("clipPath")
  //             .attr("id", "clip-" + id)
  //           .append("rect")
  //             .attr("width", width)
  //             .attr("height", height);

  //         g.selectAll(".bar")
  //             .data(["background", "foreground"])
  //           .enter().append("path")
  //             .attr("class", function(d) { return d + " bar"; })
  //             .datum(group.all());

  //         g.selectAll(".foreground.bar")
  //             .attr("clip-path", "url(#clip-" + id + ")");

  //         g.append("g")
  //             .attr("class", "axis")
  //             .attr("transform", "translate(0," + height + ")")
  //             .call(axis);

  //         // Initialize the brush component with pretty resize handles.
  //         var gBrush = g.append("g").attr("class", "brush").call(brush);
  //         gBrush.selectAll("rect").attr("height", height);
  //         gBrush.selectAll(".resize").append("path").attr("d", resizePath);
  //       }

  //       // Only redraw the brush if set externally.
  //       if (brushDirty) {
  //         brushDirty = false;
  //         g.selectAll(".brush").call(brush);
  //         div.select(".title a").style("display", brush.empty() ? "none" : null);
  //         if (brush.empty()) {
  //           g.selectAll("#clip-" + id + " rect")
  //               .attr("x", 0)
  //               .attr("width", width);
  //         } else {
  //           var extent = brush.extent();
  //           g.selectAll("#clip-" + id + " rect")
  //               .attr("x", x(extent[0]))
  //               .attr("width", x(extent[1]) - x(extent[0]));
  //         }
  //       }

  //       g.selectAll(".bar").attr("d", barPath);
  //     });

  //     function barPath(groups) {
  //       var path = [],
  //           i = -1,
  //           n = groups.length,
  //           d;
  //       while (++i < n) {
  //         d = groups[i];
  //         path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
  //       }
  //       return path.join("");
  //     }

  //     function resizePath(d) {
  //       var e = +(d == "e"),
  //           x = e ? 1 : -1,
  //           y = height / 3;
  //       return "M" + (.5 * x) + "," + y
  //           + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
  //           + "V" + (2 * y - 6)
  //           + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
  //           + "Z"
  //           + "M" + (2.5 * x) + "," + (y + 8)
  //           + "V" + (2 * y - 8)
  //           + "M" + (4.5 * x) + "," + (y + 8)
  //           + "V" + (2 * y - 8);
  //     }
  //   }

  //   brush.on("brushstart.chart", function() {
  //     var div = d3.select(this.parentNode.parentNode.parentNode);
  //     div.select(".title a").style("display", null);
  //   });

  //   brush.on("brush.chart", function() {
  //     var g = d3.select(this.parentNode),
  //         extent = brush.extent();
  //     if (round) g.select(".brush")
  //         .call(brush.extent(extent = extent.map(round)))
  //       .selectAll(".resize")
  //         .style("display", null);
  //     g.select("#clip-" + id + " rect")
  //         .attr("x", x(extent[0]))
  //         .attr("width", x(extent[1]) - x(extent[0]));
  //     dimension.filterRange(extent);
  //   });

  //   brush.on("brushend.chart", function() {
  //     if (brush.empty()) {
  //       var div = d3.select(this.parentNode.parentNode.parentNode);
  //       div.select(".title a").style("display", "none");
  //       div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
  //       dimension.filterAll();
  //     }
  //   });

  //   chart.margin = function(_) {
  //     if (!arguments.length) return margin;
  //     margin = _;
  //     return chart;
  //   };

  //   chart.x = function(_) {
  //     if (!arguments.length) return x;
  //     x = _;
  //     axis.scale(x);
  //     brush.x(x);
  //     return chart;
  //   };

  //   chart.y = function(_) {
  //     if (!arguments.length) return y;
  //     y = _;
  //     return chart;
  //   };

  //   chart.dimension = function(_) {
  //     if (!arguments.length) return dimension;
  //     dimension = _;
  //     return chart;
  //   };

  //   chart.filter = function(_) {
  //     if (_) {
  //       brush.extent(_);
  //       dimension.filterRange(_);
  //     } else {
  //       brush.clear();
  //       dimension.filterAll();
  //     }
  //     brushDirty = true;
  //     return chart;
  //   };

  //   chart.group = function(_) {
  //     if (!arguments.length) return group;
  //     group = _;
  //     return chart;
  //   };

  //   chart.round = function(_) {
  //     if (!arguments.length) return round;
  //     round = _;
  //     return chart;
  //   };

  //   return d3.rebind(chart, brush, "on");
  // }
// });

