// Marionette event listeners
workspaceCollection.on('add', function(model){
  tseries = Lizard.Graphs.Timeseries.models;
  for (i in tseries){
    timeserie = tseries[i]
    parameter = ParameterCollection.get(timeserie.attributes.parameter.id);
    if (parameter != undefined){
      parameter.set({hidden:false});
    }
  };
});

workspaceCollection.on('remove', function(model){
  tseries = model.attributes.tseries;
  for (i in tseries){
    Lizard.Graphs.Timeseries.remove(tseries[i]);
    parameter = ParameterCollection.get(timeserie.attributes.parameter.id);
    if (parameter != undefined){
      parameter.set({hidden:true});
    }
  }
});