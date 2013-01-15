// Prevent console.log from throwing errors
if(typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}




var FilterModel = Backbone.Model.extend({
  initialize: function() {
    console.log('FilterModel initializing');
  }
});

var LocationModel = Backbone.Model.extend({
  initialize: function() {
    console.log('LocationModel initializing');
  }
});

var ParameterModel = Backbone.Model.extend({
  initialize: function() {
    console.log('ParameterModel initializing');
  }
});

var FilterCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('FilterCollection initializing');
  },
  url: '',
  model: FilterModel
});

var LocationCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('LocationCollection initializing');
  },
  url: '',
  model: LocationModel
});

var ParameterCollection = Backbone.Collection.extend({
  initialize: function() {
    console.log('ParameterCollection initializing');
  },
  url: 'http://test.api.dijkdata.nl/api/v0/timeseries/?format=json',
  model: ParameterModel,
  parse: function(res, xhr) {
    console.log(res.results);
    return res.results;
  }
});







var filterTreeData = [
  {
    nodeName: 'Waternet',
    nodeId: '1',
    nodes: [
      {
        nodeName: 'Amstel',
        nodes: [
          { nodeName: 'Project X' },
          { nodeName: 'Project Y' },
          { nodeName: 'Project Z' }
        ]
      },
      {
        nodeName: 'Vecht',
        nodes: [
          { nodeName: 'Projecten' },
          {
              nodeName: 'Noord',
              nodes: [
                  { nodeName: 'Project A' },
                  { nodeName: 'Project B' },
                  { nodeName: 'Project C' }
              ]
          },
          { nodeName: 'Oude projecten' }
        ]
      }
    ]
  },
  {
    nodeName: 'Hunze en Aa\'s',
    nodes: [
      {
        nodeName: 'Dijk 1',
        nodes: [
          { nodeName: '1.1.1' },
          { nodeName: '1.1.2' },
          { nodeName: '1.1.3' }
        ]
      },
      {
        nodeName: 'Dijk 2',
        nodes: [
          { nodeName: '2.1.1' },
          { nodeName: '2.1.2' },
          { nodeName: '2.1.3' }
        ]
      }
    ]
  }
];



var TreeView = Backbone.Marionette.CompositeView.extend({
  template: '#node-template',
  tagName: 'ul',
  initialize: function() {
    // grab the child collection from the parent model
    // so that we can render the collection as children
    // of this parent node
    this.collection = this.model.nodes;
  },
  appendHtml: function(collectionView, itemView){
    // ensure we nest the child list inside of
    // the current list item
    collectionView.$('li:first').append(itemView.el);
  },
  onShow: function() {
    console.log('onShow() of TreeView');
  }
});

// The tree's root: a simple collection view that renders
// a recursive tree structure for each item in the collection
var TreeRoot = Backbone.Marionette.CollectionView.extend({
    tagName: 'div',
    itemView: TreeView,
    onShow: function() {
      $(this.el).addClass('jsTree');
      var $tree = $(this.el).jstree({
        'plugins' : [ 'themes', 'html_data', 'ui', 'cookies']
      });
    }
});



TreeNode = Backbone.Model.extend({
    initialize: function() {
        var nodes = this.get('nodes');
        if (nodes) {
            this.nodes = new TreeNodeCollection(nodes);
            this.unset('nodes');
        }
    }
});

TreeNodeCollection = Backbone.Collection.extend({
    model: TreeNode
});



// Instantiate the Application()
Lizard = new Backbone.Marionette.Application();

// Add regions for Lizards main interface (menu + content)
Lizard.addRegions({
  content: '#content',
  menu: '#menu'
});

// Start Backbone's url router
Lizard.on('initialize:after', function() {
  Backbone.history.start();
});