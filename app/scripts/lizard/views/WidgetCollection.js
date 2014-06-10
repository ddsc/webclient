Lizard.Views.WidgetCollection = Backbone.Marionette.CollectionView.extend({
  // Creates the Gridster UL element
  collection: new Lizard.Collections.Widget(),
  tagName: 'ul',
  className: 'gridster',
  itemView: Lizard.ui.Widgets.Widget,

  initialize: function(){
    this.listenTo(this.collection, 'reset', this.render, this);
  },
  onShow: function() {
    var self = this;
    var gridster = $('.gridster').gridster({
      widget_margins: [10, 10],
      widget_base_dimensions: [70, 70],
      min_cols: 8,
      max_cols: 12,
      min_rows: 6,
      max_rows: 12,
      max_size_x: 8,
    }).data('gridster').disable();
  }
});
