GraphLegendItemView = Backbone.Marionette.ItemView.extend({
  initialize: function() {
    console.log('GraphLegendItemView initializing');
  },
  template: '#graphs-legend-template',
  events: {
    'drop': 'handleDrop'
  },
  handleDrop: function() {
    alert('Dropped!');
  }
});

GraphLegendCollection = Backbone.Marionette.CollectionView.extend({
  itemView: GraphLegendItemView,
  emptyView: Lizard.Map.NoItemsView
});
