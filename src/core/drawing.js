import {stack} from 'd3-shape';
import {self, extend} from 'd3-quant';
import {GiottoBase} from './defaults';
import {Paper} from './paper';

/**
 * Drawing Class
 *
 * A Drawing is paert of a paper and therefore it receive the same updates
 * a paper receive.
 *
 * base class for all drawings
 */
export class Drawing extends GiottoBase {

    constructor (paper, options) {
        super(options);
        var draw = self.get(this);
        draw.paper = paper;
        draw.show = true;
    }

    get paper () {
        return self.get(this).paper;
    }

    /**
     * Draw itself into a paper.layer
     *
     * @param paper
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
        var o1 = this.giotto.options()[name];
        // paper options
        var o2 = this.options()[name];
        options = extend(true, {}, defaultOptions, o1, o2, options);
        var draw = new Class(this, options);
        self.get(this).draws.push(draw);
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
