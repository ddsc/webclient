Lizard.Models.Widget = Backbone.Model.extend({
  defaults: {
    col:3,
    row:1,
    size_x:2,
    size_y:2,
    type: 'gage', //template
    title:'Title',
    //gaugeId:_.uniqueId('gauge_'), todo, add to initialisation
    label:'%',
    min:0,
    max:100,
    refreshRate: 50000
  },
  initialize: function(obj) {

    if (!obj.widgetId) {
      this.set({ widgetId: _.uniqueId('widget_')});
    }
  }
});