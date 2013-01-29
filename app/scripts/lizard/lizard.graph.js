Lizard.Graphs = {};


Lizard.Graphs.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#graphs-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'mainRegion': '#mainRegion',
    'parametersRegion': 'p#parametersRegion',
    'filtersRegion': 'p#filtersRegion',
    'locationsRegion': 'p#locationsRegion',
    'collageRegion' : '#collageRegion'
  }
});

Lizard.Graphs.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'graphs': 'graphs'
    }
});


Lizard.Graphs.TimeserieView = Backbone.Marionette.ItemView.extend({
  template: '#timeserieview-template',
  initialize: function(){
    console.log('TimeserieView.initialize()');
  },
  onShow: function() {
    var context = cubism.context()
        .serverDelay(new Date(2012, 4, 2) - Date.now())
        .step(864e5)
        .size($(window).width())
        .stop();

    d3.select('#demo').selectAll('.axis')
        .data(['bottom'])
      .enter().append('div')
        .attr('class', function(d) { return d + ' axis'; })
        .each(function(d) { d3.select(this).call(context.axis().ticks(12).orient(d)); });

    d3.select('#demo').append('div')
        .attr('class', 'rule')
        .call(context.rule());

    d3.select('#demo').selectAll('.horizon')
        .data(['DIJK1', 'DIJK2', 'DIJK3', 'DIJK4', 'DIJK5', 'DIJK6', 'DIJK7', 'DIJK8', 'DIJK9', 'DIJK10', 'DIJK11', 'DIJK12', 'DIJK13', 'DIJK14', 'DIJK15', 'DIJK16', 'DIJK17', 'DIJK18', 'DIJK19'].map(stock))
      .enter().insert('div', '.bottom')
        .attr('class', 'horizon')
      .call(context.horizon()
        .format(d3.format('+,.2p')));

    context.on('focus', function(i) {
      // d3.selectAll('.value').style('right', i == null ? null : context.size() - i*2 + 'px'); // commented because it's hard to get the value-slider to work in a responsive site..
    });
    
    function stock(name) {
      var format = d3.time.format('%d-%b-%y');
      return context.metric(function(start, stop, step, callback) {
        d3.csv('data/' + name + '.csv', function(rows) {
          rows = rows.map(function(d) { return [format.parse(d.Date), +d.Open]; }).filter(function(d) { return d[1]; }).reverse();
          var date = rows[0][0], compare = rows[400][1], value = rows[0][1], values = [value];
          rows.forEach(function(d) {
            while ((date = d3.time.day.offset(date, 1)) < d[0]) values.push(value);
            values.push(value = (d[1] - compare) / compare);
          });
          callback(null, values.slice(-context.size()));
        });
      }, name);
    }
  }
});




var FilterView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('FilterView.initialize()');
  },
  tagName: 'li',
  template: '#filterview-template'
});

var FilterCollectionView = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.Collections.FilterCollection(),
  tagName: 'ul',
  
  itemView: FilterView,
  initialize: function(){
      this.collection.fetch();
      this.bindTo(this.collection, 'reset', this.render, this);
  }
});

var LocationView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('LocationView.initialize()');
  },
  tagName: 'li',
  template: '#locationview-template'
});

var LocationCollectionView = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.Collections.LocationCollection(),
  tagName: 'ul',
  
  itemView: LocationView,
  initialize: function(){
      this.collection.fetch();
      this.bindTo(this.collection, 'reset', this.render, this);
  }
});



var ParameterView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    console.log('ParameterView.initialize()');
  },
  tagName: 'li',
  template: '#parameterview-template'
});

var ParameterCollectionView = Backbone.Marionette.CollectionView.extend({
  collection: new Lizard.Collections.ParameterCollection(),
  tagName: 'ul',
  
  itemView: ParameterView,
  initialize: function(){
      this.collection.fetch();
      this.bindTo(this.collection, 'reset', this.render, this);
  }
});




Lizard.Graphs.graphs = function(){
  console.log('Lizard.Graphs.graphs()');

  // Instantiate Graphs's default layout
  var graphsView = new Lizard.Graphs.DefaultLayout();
  Lizard.App.content.show(graphsView);

  graphsView.filtersRegion.show(filtercollectionview.render());
  graphsView.locationsRegion.show(locationcollectionview.render());
  graphsView.parametersRegion.show(parametercollectionview.render());
  graphsView.collageRegion.show(collageView.render());

  var timeserieView = new Lizard.Graphs.TimeserieView();
  graphsView.mainRegion.show(timeserieView.render());

  // And set URL to #graphs
  Backbone.history.navigate('graphs');
};

Lizard.App.addInitializer(function(){
  Lizard.Graphs.router = new Lizard.Graphs.Router({
    controller: Lizard.Graphs
  });
  
  Lizard.App.vent.trigger('routing:started');
});







