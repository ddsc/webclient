Lizard.Views.Timeseries = Backbone.Marionette.ItemView.extend({
    initialize: function(options) {
        this.graphCollection = options.graphCollection;
        //this.model.on('change', this.render, this);
    },
    tagName: 'li',
    events: {
        'click .info': 'showInfoModal',
        'click .add': 'drawGraph',
        'click .add-tablet' : 'tabletGraph'
        // 'scroll': 'loadMore'
    },
    // loadMore: function() {
        // var totalHeight = this.$('> div').height(), scrollTop = this.$el.scrollTop() + this.$el.height(), margin = 100;
        // console.log('scroll')
        // if (scrollTop + margin >= totalHeight) {
            // this.model.collection
        // }
    // },
    showInfoModal: function() {
        var infoModalView = new Lizard.Views.InfoModal({
            model: this.model
        });
        window.graphsView.infomodal.show(infoModalView);
        window.graphsView.infomodal.$el.modal();
    },
    drawGraph: function(e) {
        // add to first graph in the graphs view
        var url = $(e.target).data('url');
        if (!url) {
            url = $(e.target).parents('.add[data-url]').data('url');
        }
        this.graphCollection.models[0].get('graphItems').addTimeseriesByUrl(url);
    },
    tabletGraph: function(e) {
        // add to first graph in the graphs view
        var url = $(e.target).data('url');
        if (!url) {
            url = $(e.target).parents('.add[data-url]').data('url');
        }
        var index = parseInt($(e.target).html()) - 1
        this.graphCollection.models[index].get('graphItems').addTimeseriesByUrl(url);
    },
    template: function(model) {
        return _.template($('#timeserie-item-template').html(), {
            url: model.url,
            name: model.name,
            parameter: model.parameter,
            unit: model.unit,
            uuid: model.uuid,
            events: model.events,
            favorite: model.favorite
        }, {
            variable: 'timeserie'
        });
    }
});

//
// Lizard.Views.TimeseriesCollection = Backbone.Marionette.CollectionView.extend({
    // initialize: function(options) {
        // this.collection = options.collection;
        // this.graphCollection = options.graphCollection;
        // this.collection.fetch()
    // },
    // tagName: 'ul',
    // itemView: Lizard.Views.Timeseries,
    // itemViewOptions: function(model) {
        // return {
            // graphCollection: this.graphCollection
        // };
    // }
// });

Lizard.Views.InfiniteTimeseries = Backbone.Marionette.CollectionView.extend({
    itemView: Lizard.Views.Timeseries,
    className: 'infinite-timeseries',
    isLoading: false,
    itemViewOptions: function (model) {
        return {
            graphCollection: this.graphCollection
        };
    },
    initialize: function(options) {
        this.graphCollection = options.graphCollection;
    },
    // events: {
        // 'click .info': 'showInfoModal'
    // },
    // showInfoModal: function(event) {
        // var tsuuid = $(event.target).parent().parent().data().uuid;
        // model = this.timeseriesCollection.where({uuid: tsuuid})[0];
        // infoModalView = new Lizard.Views.InfoModal({
            // model: model
        // });
        // window.graphsView.infomodal.show(infoModalView.render());
        // $('#info-modal').modal();
    // },
    handleScroll: function(e) {
        this.checkScroll();
    },
    onShow: function(e) {
        this.$el.parent().on('scroll.timeseries', this.handleScroll.bind(this));
        this.collection.fetch();
    },
    onClose: function(e) {
        this.$el.parent().off('scroll.timeseries');
    },
    checkScroll: function() {
        var self = this;
        var triggerPoint = 200;
        // console.log('this.el.scrollTop', this.el.parentNode.scrollTop);
        // console.log('this.el.clientHeight', this.el.clientHeight);
        // console.log('triggerPoint', triggerPoint);
        if (!this.collection.isLoading && this.el.parentNode.scrollTop + this.el.parentNode.clientHeight + triggerPoint > this.el.scrollHeight) {
            $('.loading-indicator').show();
            this.collection.isLoading = true;
            this.collection.page += 1;
            // Load next page
            this.collection.fetch({add: true})
            .always(function () {
                $('.loading-indicator').hide();
                setTimeout(function () {
                    self.isLoading = false;
                }, 500);
            });
        }
    }
});

Lizard.Views.TimeseriesSearch = Backbone.Marionette.View.extend({
    searchTimeout: null,
    initialize: function(options) {
        this.timeseriesCollection = options.timeseriesCollection;
    },
    render: function() {
        tpl = '<div class="row-fluid"><input type="text" class="span12 search-query" placeholder="Zoeken" id="searchTimeseries" name="searchTimeseries"></div>';
        this.$el.html(tpl);
        return this;
    },
    events: {
        'keypress #searchTimeseries': 'search'
    },
    search: function(e) {
        var self = this;

        if (this.searchTimeout !== null) {
            window.clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }

        this.searchTimeout = window.setTimeout(function () {
            self.timeseriesCollection.reset();
            self.timeseriesCollection.page = 1;
            self.timeseriesCollection.isLoading = true;
            self.timeseriesCollection.query = $('#searchTimeseries').val();
            self.timeseriesCollection.fetch({add: false})
            .always(function () {
                self.timeseriesCollection.isLoading = false;
            });
        }, 700);
    }
});
