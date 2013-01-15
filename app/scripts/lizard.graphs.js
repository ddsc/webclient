Lizard.Graphs = {};


Lizard.Graphs.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#graphs-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'mainRegion': '#mainRegion',
    'parametersRegion': 'p#parametersRegion'
  }
});

Lizard.Graphs.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'graphs': 'graphs'
    }
});



var personModel = new Backbone.Model();
personModel.set({
  firstName: 'John',
  lastName: 'Doe',
  city: 'Utrecht',
  street: 'Neude'
});
personModel.bind('change', function() {
  $('#summary blockquote code').html(JSON.stringify(personModel.toJSON(), null, 4));
});

Lizard.Graphs.TestView = Backbone.Marionette.ItemView.extend({
  _modelBinder: undefined,
  template: '#testview-template',
  initialize: function(){
    console.log('TestView.initialize()');
    this._modelBinder = new Backbone.ModelBinder();
  },
  close: function() {
    this._modelBinder.unbind();
  },
  onShow: function() {
    this._modelBinder.bind(personModel, this.el);
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
      collection: new ParameterCollection(),
      tagName: 'ul',
      
      itemView: ParameterView,
      initialize: function(){
          this.collection.fetch();
          this.bindTo(this.collection, 'reset', this.render, this)
      }
  });







Lizard.Graphs.graphs = function(){
  console.log('Lizard.Graphs.graphs()');

  // Instantiate Graphs's default layout
  var graphsView = new Lizard.Graphs.DefaultLayout();
  Lizard.content.show(graphsView);


  var tree = new TreeNodeCollection(filterTreeData);
  var treeView = new TreeRoot({
      collection: tree
  });

  treeView.on('render', function() {
    console.log('Rendering tree in graphs view..');
    $('.jsTree').jstree('open_all');
  });

  // graphsView.sidebarRegion.show(treeView);
  var parametercollectionview = new ParameterCollectionView();
  graphsView.parametersRegion.show(parametercollectionview.render());


  var testView = new Lizard.Graphs.TestView();
  graphsView.mainRegion.show(testView.render());

  

  Backbone.history.navigate('graphs');
};

Lizard.addInitializer(function(){
  Lizard.Graphs.router = new Lizard.Graphs.Router({
    controller: Lizard.Graphs
  });
  
  Lizard.vent.trigger('routing:started');
});







