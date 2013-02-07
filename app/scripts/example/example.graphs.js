Example.Graphs = {};

Example.Graphs.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#graphs-template',
  regions: {
    'collageList': '#collageList',
    'collagaListFooter': '#new-collage',
    'selectedCollage': '#selectedCollage',
    'graphStack': '#graphStack',
    'timeseriesSelection': '#timeseriesSelection'
  },

  events: {
    'keypress #new-collage': 'createOnEnter'
  },

  createOnEnter: function(event){
    var ENTER_KEY = 13;
    var input = $('#new-collage');
    var val = input.val().trim();
    if (event.which !== ENTER_KEY|| !val) {
      return;
    }

    collageCollection.create({
      name: val});
    input.val('');
  }

});

Example.Graphs.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'graphs': 'graphs'
    }
});

//create model and views instances for this page. ToDo: put in initailize function

collageModel = new Lizard.models.Collage({name: '-'});

collageCollection = new Lizard.collections.Collage();
activeCollageItems = new Lizard.collections.CollageItem();

//activeCollageCollection = new

activeCollageView = new Lizard.views.ActiveCollage({
	model: collageModel,
	collection: activeCollageItems
});

collageModel.on('change', activeCollageView.render())

collageListView = new Lizard.views.CollageList({
	collection: collageCollection
});

collageListView.on('itemview:selectItem', function(childview, model) {
    //selectCollageView
    //console.log(this.model);
    activeCollageView.setCollage(model);
});


graphStackView = new Lizard.views.GraphStack({
    collection: activeCollageItems
});

locationList = new Lizard.views.LocationCollection({

});

Example.Graphs.graphs = function(){
	console.log('Example.Graphs.graphs()');

	// Instantiate Graphs's default layout
	var graphsView = new Example.Graphs.DefaultLayout();
	Example.App.content.show(graphsView);

	graphsView.collageList.show(collageListView.render());
    graphsView.selectedCollage.show(activeCollageView.render());
    graphsView.graphStack.show(graphStackView.render());
    graphsView.timeseriesSelection.show(locationList.render());

    collageCollection.fetch();

    // And set URL to #graphs
    Backbone.history.navigate('graphs');
};

Example.App.addInitializer(function(){
  Example.Graphs.router = new Example.Graphs.Router({
    controller: Example.Graphs
  });

  Example.App.vent.trigger('routing:started');
});
