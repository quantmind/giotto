import {scaleLinear} from 'd3-scale';
import {isArray, isObject, isNumber, isString} from 'd3-quant';
import * as d3 from 'd3-color';

/**
 * A gradient class for coloring svg or canvas background
 */
class Gradient {

    constructor (opts) {
        if (!opts) opts = {};
        this.colors = gradientColor(opts.colors ? opts.colors : opts);
        this.image = opts.image;
        this.mode = opts.mode;
        this.xscale = scaleLinear();
        this.yscale = scaleLinear();
        this.context = null;
        if (!this.mode && this.colors.length > 1)
            this.mode = 'x';
    }

    draw () {
        var context = this.context,
            grad;

        if (!context)
            context = new SvgGradient();

        if (isString(this.image)) {
            var g = this,
                image = new Image;
            image.src = this.image;
            image.onload = function () {
                g.image = image;
                g.draw();
            };
            return;
        } else if (this.image) {
            context.drawImage(this.image, 0, 0);
        }

        var x1 = this.xscale(0),
            x2 = this.xscale(1),
            y1 = this.yscale(0),
            y2 = this.yscale(1);

        if (this.mode === 'x')
            grad = context.createLinearGradient(x1, y1, x2, y1);
        else if (this.mode === 'y')
            grad = context.createLinearGradient(x1, y1, x1, y2);
        else if (this.mode === 'r') {
            var xc = (x1 + x2)/2;
            var yc = (y1 + y2)/2;
            var r2 = Math.sqrt(xc*xc+yc*yc);
            grad = context.createRadialGradient(xc, yc, 0, xc, yc, r2);
        } else if (this.mode) {
            var modeFunction = gradient[this.mode];
            if (modeFunction) grad = modeFunction.call(this);
        }

        if (grad)
            this.colors.forEach(function(c) {
                grad.addColorStop(c.offset, c.color);
            });
        else
            grad = '' + this.colors[0].color;

        context.fillStyle = grad;
        context.fillRect(x1, y1, x2-x1, y2-y1);
        return context;
    }

    voronoi () {

    }
}


class SvgGradient {

    constructor () {
        this.offsets = [];
    }

    draw (svg) {
        var rect = this.rect;

        var elem = svg.selectAll('rect').data([true]);

        elem.enter().append('rect')
            .attr('x', rect.x)
            .attr('y', rect.y)
            .attr('width', rect.width)
            .attr('height', rect.height);

        if (this.fillStyle === this) {

            var grad = svg.append('linearGradient'),
                x1 = this.xscale(rect.x),
                y1 = this.yscale(rect.y),
                x2 = this.yscale(rect.x + rect.width),
                y2 = this.yscale(rect.y + rect.height);

            grad.attr('x1', x1 + '%').attr('y1', y1 + '%')
                .attr('x2', x2 + '%').attr('y2', y2 + '%');

            this.offsets.forEach(function (c) {
                grad.append("stop")
                    .attr("offset", 100*c.offset + "%")
                    .attr("stop-color", c.color);
                    //.attr("stop-opacity", c.opacity);
            });
        } else {
            elem.attr('fill', this.fillStyle);
        }
        return elem;
    }

    createLinearGradient (x1, y1, x2, y2) {
        this.xscale = scaleLinear().range(0, 100).domain([x1, y1]);
        this.yscale = scaleLinear().range(0, 100).domain([y1, y2]);
        return this;
    }

    addColorStop (offset, color) {
        this.offsets.push({offset: offset, color: color});
    }

    fillRect (x, y, width, height) {
        this.rect = {
            x: x,
            y: y,
            width: width,
            height: height
        };
    }
}


function gradientColor (color) {
    if (!isArray(color))
        color = [color];

    var N = color.length-1;

    return color.map(function (c, i) {
        if (!c) c = '#fff';
        color = d3.color(isObject(c) ? c.color : c);
        if (isNumber(c.opacity))
            color.opacity = c.opacity;

        return {
            offset: isNumber(c.offset) ? c.offset : N ? i/N : 0,
            color: color
        };
    });
}


export default function gradient (opts) {
    return new Gradient(opts);
}
