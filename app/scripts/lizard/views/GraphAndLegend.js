Lizard.Views.GraphAndLegendView = Backbone.Marionette.Layout.extend({
    template: '#graph-and-legend-template',
    initialize: function (options) {
        this.listenTo(this.model, 'change', this.updateScatterPlotCheckbox, this);
    },
    events: {
        'dragover': function () {return false;},
        'dragenter': function () {return false;},
        'drop': 'onDrop'
    },
    regions: {
        legendItems: ".legend-items",
        graph: ".graph-region"
    },
    onDragover: function(e) {
    },
    onDragenter: function(e) {
    },
    onDrop: function(e) {
        e.preventDefault();
        $('#sidebar').css('-webkit-filter', 'blur(0px)'); // disable target div blur
        $('.graph').removeClass('stitched'); // remove stitch border
        // fetch and add the timeseries
        var self = this;
        var dataJson = e.originalEvent.dataTransfer.getData('Text');
        if (dataJson) {
            var data = JSON.parse(dataJson);
            var timeseries = new Lizard.Models.TimeseriesActual({url: data.url});
            timeseries.fetch()
                .done(function (model, response) {
                    var item = new Lizard.Models.GraphItem({
                        timeseries: model
                        // , color: colorbrewer.Set3[9][Math.floor((Math.random()*8)+1)]
                    });
                    self.model.get('graphItems').add(item);
                });
        }
    },
    updateScatterPlotCheckbox: function(e) {
        var $drawWhenToItems = this.$el.find('.draw-when-to-items');
        if (this.model.get('hasTwoItems') === true) {
            $drawWhenToItems.removeClass('hide');
        }
        else {
            $drawWhenToItems.addClass('hide');
        }
    },
    onShow: function(e) {
        // var plot = this.$el.find('.graph').initializePlot();
        // plot.observeCollection(this.model.get('graphItems'));
        // plot.observeInitialPeriod(account);

        var graphView = new Lizard.Views.Graph({
            model: this.model,
            account: account
        });

        var legendView = new Lizard.Views.GraphLegendCollection({
            collection: this.model.get('graphItems')
        });

        this.graph.show(graphView);
        this.legendItems.show(legendView);
    }
});
