Lizard.Views.GraphAndLegendView = Backbone.Marionette.Layout.extend({
    template: '#graph-and-legend-template',
    initialize: function (options) {
    },
    modelEvents: {
        "change:hasTwoItems": "updateScatterPlotCheckbox"
    },
    events: {
        'dragover': function () {return false;},
        'dragenter': function () {return false;},
        'drop': 'onDrop',
        'change [name="do-scatter-plot"]': 'changeScatterPlotCheckbox'
    },
    regions: {
        legendItems: ".legend-items",
        graph: ".graph-region"
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
                    model.set({pk: model.id});
                    var item = new Lizard.Models.GraphItem({
                        timeseries: model
                    });
                    self.model.get('graphItems').add(item);
                });
        }
    },
    changeScatterPlotCheckbox: function(e) {
        if ($(e.target).is(':checked')) {
            this.showScatterPlot();
        }
        else {
            this.showNormalGraph();
        }
    },
    updateScatterPlotCheckbox: function(e) {
        var $scatterPlotForm = this.$el.find('.scatter-plot-form');
        if (this.model.get('hasTwoItems') === true) {
            $scatterPlotForm.removeClass('hide');
        }
        else {
            $scatterPlotForm.find('[name="do-scatter-plot"]')
            .removeAttr('checked')
            .trigger('change');
            $scatterPlotForm.addClass('hide');
        }
    },
    showNormalGraph: function() {
        this.graph.close();
        var graphView = new Lizard.Views.Graph({
            model: this.model,
            account: account // pass global account instance for now
        });

        this.graph.show(graphView);
    },
    showScatterPlot: function() {
        this.graph.close();
        var graphView = new Lizard.Views.ScatterPlot({
            model: this.model,
            account: account // pass global account instance for now
        });

        this.graph.show(graphView);
    },
    onShow: function(e) {
        // show the default graph
        this.showNormalGraph();

        // show the legend
        var legendView = new Lizard.Views.GraphLegendCollection({
            collection: this.model.get('graphItems')
        });

        this.legendItems.show(legendView);
    }
});
