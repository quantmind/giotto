import {select} from 'd3-selection';
import {GiottoBase, constants} from './defaults';
import {getElement} from '../utils/dom';
import * as size from '../utils/size';
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
        var paper = self.get(this);
        extend(paper, {
            giotto: giotto,
            element: getElement(element),
            draws: []
        });
        // Append the paper container
        element = this.element;

        element
            .append('div')
            .attr('id', this.id)
            .classed('gt-paper', true)
            .classed('gt-paper-' + this.type, true);
        //
        var LayerClass = Layer.type[this.type];
        paper.size = getSize(element, paper);
        paper.factor = paper.options.factor || LayerClass.getFactor();
        paper.background = new LayerClass(this, 'gt-background');
        paper.drawings = new LayerClass(this, 'gt-drawings');
        paper.foreground = new LayerClass(this, 'gt-foreground');
        this.clear();
    }

    get factor () {
        return self.get(this).factor;
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

    get domWidth () {
        return self.get(this).size[0];
    }

    get domHeight () {
        return self.get(this).size[1];
    }

    get size () {
        return self.get(this).size.slice();
    }

    /**
     * Draw the paper
     */
    draw () {

    }

    /**
     * Refresh the paper by setting proper dimension and positioning
     */
    clear () {
        var container = this.container;
        var first_container = this.element.select('.gt-paper').node();
        var position = container.node() === first_container ? 'relative' : 'absolute';
        container.style("position", position);
        this.background.clear();
        this.drawings.clear();
        this.foreground.clear();
        this.draw();
    }

    remove () {
        return this.giotto.remove(this);
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

    get factor () {
        return self.get(this).paper.type;
    }

    get context () {
        return null;
    }
}

Layer.type = {};
Layer.getFactor = function () {
    return 1;
}


function pc (margin, size) {
    if (isString(margin) && margin.indexOf('%') === margin.length-1)
        margin = round(0.01*parseFloat(margin)*size, 5);
    return margin;
}

// Intrnal function for evaluating paper dom size
export function getSize (element, p) {
    var width = p.options.width;
    var height = p.options.height;

    if (!width) {
        width = size.getWidth(element);
        if (width)
            p.elwidth = size.getWidthElement(element);
        else
            width = constants.WIDTH;
    }

    if (!height) {
        height = size.getHeight(element);
        if (height)
            p.elheight = size.getHeightElement(element);
        else
            height = constants.HEIGHT;
    }
    // Allow to specify height as a percentage of width
    else if (typeof(height) === "string" && height.indexOf('%') === height.length-1) {
        p.height_percentage = 0.01*parseFloat(height);
        height = round(p.height_percentage*width);
    }

    return [width, height];
}
