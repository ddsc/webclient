Lizard.Views.Collage = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: '#collage-template',
  events: {
    'click .layer-item': 'select',
    'click .remove' : 'removeCollage',
    'click .save' : 'saveCollage'
  },
  initialize: function () {
    this.model.bind('change', this.render);
  },
  removeCollage: function(){
    this.model.destroy();
    $('.top-right').notify({
        type: 'alert',
        message: {
          text: 'Grafiek samenstelling is succesvol verwijderd'
        }}).show();
  },
  saveCollage: function(){
    this.model.save();
    $('.top-right').notify({
        message: {
          text: 'Grafiek samenstelling is succesvol opgeslagen'
        }}).show();
  },
  //create a radio button (one workspace selected at a time)
  select: function(e) {
    if(this.model.get('selected') === false) {
      this.model.collection.each(function(collage) {
        collage.set('selected', false);
      });
      this.model.set('selected', true);
      this.model.trigger('select_collage', this.model);
    }
  }
});

Lizard.Views.CollageList = Backbone.Marionette.CollectionView.extend({
  itemView: Lizard.Views.Collage,
  initialize: function(options) {
    this.graphCollection = options.graphCollection;
    this.listenTo(this.collection,
      "select_collage",
      this.selectCollage
    );
  },
  collection: null, //workspaceCollection,
  tagName: 'ol',
  className: 'drawer-group',

  selectCollage: function(selectedModel) {
    var self = this;
    this.graphCollection.each(function (graph) {
        graph.get('graphItems').reset();
    })

    var collageItems = selectedModel.get('collageitems');
    // fetch all timeseries for each collage item
    collageItems.each(function (collageItem) {
        var graph = self.graphCollection.models[collageItem.get('graph_index')];
        var timeseriesList = collageItem.get('timeseries');
        for (var i in timeseriesList) {
            var timeseriesUrl = timeseriesList[i];
            var timeseries = new Lizard.Models.TimeseriesActual({url: timeseriesUrl});
            timeseries.fetch()
                .done(function (model, response) {
                    model.set({pk: model.id});
                    var graphItem = new Lizard.Models.GraphItem({timeseries: model});
                    graph.get('graphItems').add(graphItem);
                });
        }
    });
    Backbone.history.navigate('graphs/' + selectedModel.id);
  },
  onDomRefresh: function () {
    $('.drawer-group').disableSelection();
  }
});
