import {stack} from 'd3-shape';
import {GiottoBase} from './defaults';
import {Paper} from './paper';
import {_parentScope} from './plugin';

/**
 * Drawing Class
 *
 * base class for all drawings in a Paper
 */
export class Drawing extends GiottoBase {

    get data () {
        var data = this.root.data();
        return data;
    }

    get paper () {
        return this.parent;
    }

    /**
     * Draw itself into a paper.layer
     *
     * This method is called by the paper when it needs to draw the drawing
     * It should not be called directly
     */
    draw () {
    }
}

export class StackedDrawing extends Drawing {

    draw () {
        var data = this.data();
        var options = this.options;
        this.st = stack()
                    .keys(data.fields)
                    .order(options.stackOrder)
                    .offset(options.stackOffset);

    }
}


export function paperDraw (Class, defaultOptions) {
    var name = Class.name.toLowerCase();

    Paper.prototype[name] = function (options) {
        // default options from giotto
        var root = _parentScope(this.$scope, name, defaultOptions),
            draw = new Class(root.$new().$extend(options));

        // add the draw to paper draws
        this.$scope.$draws.push(draw);
        // draw to the paper
        if (!draw.broadcast('draw').defaultPrevented)
            draw.draw();

        return draw;
    };

    Paper.prototype[name].defaults = defaultOptions;
}


Drawing.prototype.show = paperBound('show');


export function paperBound (name) {

    return function (_) {
        var d = self.get(this);
        if (arguments.length === 0) return d[name];
        var current = d[name];
        if (_ != current) {
            d[name] = _;
            this.paper.scheduleRedraw();
        }
        return this;
    }
}
