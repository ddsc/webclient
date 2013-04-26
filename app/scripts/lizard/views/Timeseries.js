Lizard.Views.Timeseries = Backbone.Marionette.ItemView.extend({
  initialize: function (options) {
    this.graphCollection = options.graphCollection;
    this.model.on('change', this.render, this);
  },
  tagName: 'li',
  events: {
    'click .info': 'showInfoModal',
    'click .add': 'drawGraph'
  },
  showInfoModal: function() {
    console.log('showInfoModal');
    infoModalView = new Lizard.Views.InfoModal({model: this.model});
    window.graphsView.infomodal.show(infoModalView.render());
    $('#info-modal').modal();
  },
  drawGraph: function (e){
    // add to first graph in the graphs view
    var url = $(e.target).data('url');
    this.graphCollection.models[0].get('graphItems').addTimeseriesByUrl(url);
  },
  template: function(model){
      return _.template($('#timeserie-item-template').html(), {
        url: model.url,
        name: model.name,
        uuid: model.uuid,
        events: model.events,
        favorite: model.favorite
      }, {variable: 'timeserie'});
    }
});

Lizard.Views.TimeseriesCollection = Backbone.Marionette.CollectionView.extend({
    initialize: function (options) {
        this.collection = options.collection;
        this.graphCollection = options.graphCollection;
    },
    tagName: 'ul',
    itemView: Lizard.Views.Timeseries,
    itemViewOptions: function (model) {
        return {
            graphCollection: this.graphCollection
        };
    }
});

Lizard.Views.InfiniteTimeseries = Backbone.View.extend({
  className: 'infinite-timeseries',
  initialize: function() {
    this.isLoading = false;
    window.infiniteTimeseriesView = this;
    this.timeseriesCollection = window.tsc;
    //_.bindAll(this, 'checkScroll');
    //$(window).scroll(this.checkScroll);
    console.log(this.el);
    // $('#selectionRegion').scroll(this.checkScroll);
  },
  events: {
    //'scroll': 'checkScroll'
  },
  // delegateEvents: function (events) {
  //   console.log(this.$el.parent());
  //   //debugger;
  //   Backbone.View.prototype.delegateEvents.call(this);
  //   this.$el.parent().on('scroll', function () {console.log('x')} );
  // },
  handleScroll: function (e) {
    this.checkScroll();
  },
  onShow: function (e) {
    this.$el.parent().on('scroll.timeseries', this.handleScroll.bind(this));
  },
  onClose: function (e) {
    this.$el.parent().off('scroll.timeseries');
  },
  // undelegateEvents: function (events) {
  //   Backbone.View.prototype.undelegateEvents.call(this);
  //   this.$el.parent().off('scroll.timeseries');
  // },
  render: function() {
    this.loadResults();
    return this;
  },
  loadResults: function() {
    $('.loading-indicator').show();
    var self = this;
    this.isLoading = true;
    this.timeseriesCollection.fetch({
      success: function(timeseries) {
        $('.loading-indicator').hide();
        _.each(timeseries.models, function(model) {
          self.$el.append(_.template($('#timeserie-item-template').html(), {
            url: model.get('url'),
            name: model.get('name'),
            uuid: model.get('uuid'),
            events: model.get('events'),
            favorite: model.get('favorite')}, {
              variable: 'timeserie'
            }));
        });
        self.isLoading = false;
      }
    });
  },
  checkScroll: function() {
    var triggerPoint = 100;
    // console.log('this.el.scrollTop', this.el.parentNode.scrollTop);
    // console.log('this.el.clientHeight', this.el.clientHeight);
    // console.log('triggerPoint', triggerPoint);
    if(!this.isLoading && this.el.parentNode.scrollTop + this.el.parentNode.clientHeight + triggerPoint > this.el.scrollHeight ) {
      this.timeseriesCollection.page += 1; // Load next page
      this.loadResults();
    }
  }
});

Lizard.Views.TimeseriesSearch = Backbone.View.extend({
  initialize: function (options) {
    this.timeseriesCollection = window.tsc;
  },
  render: function() {
    tpl = '<div class="row-fluid"><input type="text" class="span12 search-query" placeholder="Zoeken" id="searchTimeseries" name="searchTimeseries"></div>';
    this.$el.html(tpl);
    return this;
  },
  events: {'change #searchTimeseries': 'search'},
  search: function(e) {
    $(window.infiniteTimeseriesView.el).html("");
    
    window.tsc.page = 1;
 //   window.infiniteTimeseriesView.loadResults();
    window.tsc.name = $('#searchTimeseries').val();
    window.infiniteTimeseriesView.render();
//     window.tsc.fetch({
// //      data:{'name': $('#searchTimeseries').val()},
//       reset: true,
//       success: function(e) {
//         console.log('successful fetch', e);
//         // window.infiniteTimeseriesView.setResults(e);
//       }
//     });
  }
});
