import {select} from 'd3-selection';
import {GiottoBase} from './defaults';
import {getElement} from '../utils/dom';
import {self, round, extend, isString} from 'd3-quant';

/**
 * A paper is created via a giotto object
 *
 * var g = new Giotto();
 * var p = p.paper();
 */
export class Paper extends GiottoBase {

    constructor(giotto, element, options) {
        super(options);
        extend(self.get(this), {
            giotto: giotto,
            element: getElement(element),
            draws: [],
            factor: 1
        });
        // Append the paper container
        this.element
            .append('div')
            .attr('id', this.id)
            .classed('gt-paper', true)
            .classed('gt-paper-' + this.type, true);
        var LayerClass = Layer.type[this.type];
        self.get(this).background = new LayerClass(this, 'gt-background');
        self.get(this).drawings = new LayerClass(this, 'gt-drawings');
        self.get(this).foreground = new LayerClass(this, 'gt-foreground');
    }

    get giotto () {
        return self.get(this).giotto;
    }

    get element () {
        return select(self.get(this).element);
    }

    get background () {
        return self.get(this).background;
    }

    get drawings () {
        return self.get(this).drawings;
    }

    get foreground () {
        return self.get(this).foreground;
    }

    get container () {
        return this.element.select('#' + this.id);
    }

    get backgroundElement () {
        return this.container.select('.gt-background');
    }

    get drawingElement () {
        return this.container.select('.gt-drawings');
    }

    get foregroundElement () {
        return this.container.select('.gt-background');
    }

    get marginLeft () {
        var i = self.get(this);
        return i.factor*pc(i.margin.left, i.size[0]);
    }

    get marginRight () {
        var i = self.get(this);
        return i.factor*pc(i.margin.right, i.size[0]);
    }

    get marginTop () {
        var i = self.get(this);
        return i.factor*pc(i.margin.left, i.size[1]);
    }

    get marginBottom () {
        var i = self.get(this);
        return i.factor*pc(i.margin.bottom, i.size[1]);
    }

    get innerWidth () {
        var i = self.get(this);
        return i.factor*i.size[0] - this.marginLeft - this.marginRight;
    }

    get innerHeight () {
        var i = self.get(this);
        return i.factor*i.size[1] - this.marginTop - this.marginBottom;
    }

    get aspectRatio () {
        return this.innerHeight/this.innerWidth;
    }
}

/**
 * A Layer is bound to a Paper.
 *
 * Each paper has three layers:
 *
 *  background: where all background drawings are place (areas for example)
 *  drawings: where the main drawings are placed
 *  foreground: usually for transitions and animations
 */
export class Layer {

    constructor (paper, name) {
        self.set(this, {paper: paper, name: name});
    }

    get element () {
        var s = self.get(this);
        return s.paper.container.select('.' + s.name);
    }

    get paper () {
        return self.get(this).paper;
    }

    get type () {
        return self.get(this).paper.type;
    }

    get context () {
        return null;
    }
}

Layer.type = {};


function pc (margin, size) {
    if (isString(margin) && margin.indexOf('%') === margin.length-1)
        margin = round(0.01*parseFloat(margin)*size, 5);
    return margin;
}
