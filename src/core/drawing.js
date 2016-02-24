import {stack} from 'd3-shape';
import {self, extend} from 'd3-quant';
import {GiottoBase, defaults} from './defaults';
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
        self.get(this).paper = paper;
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


export function paperDraw (Class, options) {
    var name = Class.name.toLowerCase();

    Paper.prototype[name] = function (options) {
        var o1 = this.giotto.options()[name];
        var o2 = this.options()[name];
        options = extend(true, {}, o1, o2, options);
        return new Class(this, options);
    };

    defaults[name] = options;

}
