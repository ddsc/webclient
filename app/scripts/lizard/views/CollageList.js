Lizard.Views.Collage = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: '#collage-template',
  events: {
    'click .layer-item': 'select'
  },
  initialize: function () {
    this.model.bind('change', this.render);
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
    this.listenTo(this.collection,
      "select_collage",
      this.selectCollage
    );
  },
  collection: null, //workspaceCollection,
  tagName: 'ul',
  className: 'wms_sources drawer-group',
  selectCollage: function(selectedModel) {
    var graph_elements = $('.graph-drop');

    _.each(graph_elements, function(graph_element) {
      var plot = $(graph_elements).data('plot');
      if (plot) {
          plot.removeAllDataUrls();
      }
    });

    var collageItems = selectedModel.get('collageitems');

    collageItems.each(function(collageItem) {
      var graph_el = $(graph_elements[collageItem.get('graph_index')]);
      graph_el.parent().removeClass('empty');
      var timeseries = collageItem.get('timeseries');
      for (var i in timeseries) {
        var timeserie = timeseries[i];
        graph_el.loadPlotData(timeserie);

      }
    });
    Backbone.history.navigate('graphs/' + selectedModel.id);
  },
  onDomRefresh: function () {
    $('.drawer-group').disableSelection();
  }
});
