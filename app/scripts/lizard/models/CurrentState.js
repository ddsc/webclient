Lizard.Models.CurrentState = Backbone.Model.extend({
  //url: settings.account_url,
  defaults: {
    alarms: 2,
    storingen: 5,//todo: use for initialisation of map
    activeSensors: 102 ,//todo: what is a good period notation //todo: use for initialisation of graphs
    newMeasurementsLastHour: 1811
  }
});