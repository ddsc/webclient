/*
Axis Labels Plugin for flot.
http://github.com/markrcote/flot-axislabels

Original code is Copyright (c) 2010 Xuan Luo.
Original code was released under the GPLv3 license by Xuan Luo, September 2010.
Original code was rereleased under the MIT license by Xuan Luo, April 2012.

Improvements by Mark Cote.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */
(function ($) {
    var options = { };

    /* *************************************************** */

    function AxisLabel(axis, position, padding, plot, opts) {
        this.axis = axis;
        this.position = position;
        this.padding = padding;
        this.plot = plot;
        this.opts = opts;
        this.width = 0;
        this.height = 0;
    }

    /* *************************************************** */

    CanvasAxisLabel.prototype = new AxisLabel();
    CanvasAxisLabel.prototype.constructor = CanvasAxisLabel;
    function CanvasAxisLabel(axis, position, padding, plot, opts) {
        AxisLabel.prototype.constructor.call(this, axis, position, padding,
                                             plot, opts);
        if (this.opts.axisLabelFontSizePixels)
            this.axisLabelFontSizePixels = this.opts.axisLabelFontSizePixels;
        else
            this.axisLabelFontSizePixels = 14;
        if (this.opts.axisLabelFontFamily)
            this.axisLabelFontFamily = this.opts.axisLabelFontFamily;
        else
            this.axisLabelFontFamily = 'sans-serif';
    }

    CanvasAxisLabel.prototype.calculateSize = function() {
        var ctx = this.plot.getCanvas().getContext('2d');
        ctx.save();
        ctx.font = this.axisLabelFontSizePixels + 'px ' +
            this.axisLabelFontFamily;
        var measure = ctx.measureText(this.opts.axisLabel);
        this.width = measure.width;
        this.height = this.axisLabelFontSizePixels;
        ctx.restore();
    };

    CanvasAxisLabel.prototype.draw = function(box) {
        var p = this.plot;
        var ctx = this.plot.getCanvas().getContext('2d');
        ctx.save();
        ctx.textAlign = 'start';
        ctx.textBaseline = 'bottom';
        var f = this.axis.font;
        ctx.font = f.style + " " + f.variant + " " + "bold" + " " + this.axisLabelFontSizePixels + "px " + f.family;
        //ctx.font = this.axisLabelFontSizePixels + 'px ' + this.axisLabelFontFamily;
        var x, y, angle = 0;
        // draw OUTSIDE the axis tick labels box
        if (this.position == 'top') {
            x = box.left + box.width/2 - this.width/2;
            y = box.top;
        } else if (this.position == 'bottom') {
            x = box.left + box.width/2 - this.width/2;
            y = box.top + box.height + this.height + 4; // compensate for baseline
        } else if (this.position == 'left') {
            x = box.left - 4; // compensate for baseline
            y = box.height/2 + box.top + this.width/2;
            angle = -Math.PI/2;
        } else if (this.position == 'right') {
            x = box.left + box.width + 4; // compensate for baseline
            y = box.height/2 + box.top - this.width/2;
            angle = Math.PI/2;
        }
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(this.opts.axisLabel, 0, 0);
        ctx.restore();
    };

    /* *************************************************** */

    function initializeRenderer (plot, axis) {
        var opts = axis.options;
        if (!opts || !opts.axisLabel || !axis.show)
            return;

        var rendererInstance = new CanvasAxisLabel(
            axis,
            axis.position, 0,
            plot, opts
        );
        rendererInstance.calculateSize();
        return rendererInstance;
    }

    /* *************************************************** */

    function init(plot) {
        var renderersInitialized = false;
        plot.hooks.draw.push(function (plot, ctx) {
            $.each(plot.getAxes(), function(axisName, axis) {
                var opts = axis.options;
                if (!opts || !opts.axisLabel || !axis.show)
                    return;
                var renderer = initializeRenderer(plot, axis);
                renderer.draw(axis.box);
            });
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'axisLabels',
        version: '2.0b0-nens'
    });
})(jQuery);
