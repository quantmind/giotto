import {select} from 'd3-selection';
import {map} from 'd3-collection';
import {GiottoBase, constants} from './defaults';
import {getElement} from '../utils/dom';
import {Plugin} from './plugin';
import * as size from '../utils/size';
import {round, isString, isArray, isObject} from 'd3-quant';
import {popKey} from '../utils/object';

/**
 * A paper is created via a giotto object.
 * var g = new Giotto();
 * var p = p.paper();
 *
 * Its function are:
 *
 *  * size and resize the drawing window
 *  * Render drawings
 *  * Apply plugins
 *
 */
export class Paper extends GiottoBase {

    constructor(giotto, element, options) {
        super(giotto.$scope.$new().$extend(options));
        var scope = this.$scope;
        scope.$$paper = this;
        scope.$element = getElement(element);

        // Append the paper container
        element = this.element;
        var position = element.style('position');
        if (!position || position === 'static')
            element.style('position', 'relative');

        element
            .append('div')
            .attr('id', this.id)
            .classed('gt-paper', true)
            .classed('gt-paper-' + this.type, true);
        //
        var LayerClass = Layer.type[this.type];
        scope.$name = popKey(scope, 'name');
        scope.$width = popKey(scope, 'width');
        scope.$height = popKey(scope, 'height');
        scope.$minHeight = popKey(scope, 'minHeight');
        scope.$size = getSize(element, scope);
        scope.$factor = popKey(scope, 'factor') || LayerClass.getFactor();
        scope.$layers = map();
        scope.$plugins = [];
        scope.$layers.set('background', new LayerClass(this, 'gt-background'));
        scope.$layers.set('drawings', new LayerClass(this, 'gt-drawings'));
        scope.$layers.set('foreground', new LayerClass(this, 'gt-foreground'));
        scope.$draws = [];
        this.clear();
        Plugin.$apply(this);
        // Register data listener
        this.on('data.' + this.id, dataListener(this));
    }

    get element () {
        return select(this.$scope.$element);
    }

    get container () {
        return this.element.select('#' + this.id);
    }

    get data () {
        return this.root.data();
    }

    get factor () {
        return this.$scope.$factor;
    }

    get draws () {
        return this.$scope.$draws.slice();
    }

    get background () {
        return this.$scope.$layers.get('background');
    }

    get drawings () {
        return this.$scope.$layers.get('drawings');
    }

    get foreground () {
        return this.$scope.$layers.get('foreground');
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
        var scope = this.$scope;
        return scope.$factor*pc(scope.$margin.left, scope.$size[0]);
    }

    get marginRight () {
        var scope = this.$scope;
        return scope.$factor*pc(scope.$margin.right, scope.$size[0]);
    }

    get marginTop () {
        var scope = this.$scope;
        return scope.$factor*pc(scope.$margin.top, scope.$size[1]);
    }

    get marginBottom () {
        var scope = this.$scope;
        return scope.$factor*pc(scope.$margin.bottom, scope.$size[1]);
    }

    get domWidth () {
        return this.$scope.$size[0];
    }

    get domHeight () {
        return this.$scope.$size[1];
    }

    get size () {
        return this.$scope.$size.slice();
    }

    get width () {
        var scope = this.$scope;
        return scope.$factor*scope.$size[0];
    }

    get height () {
        var scope = this.$scope;
        return scope.$factor*scope.$size[1]
    }

    get innerWidth () {
        return this.width - this.marginLeft - this.marginRight;
    }

    get innerHeight () {
        return this.height - this.marginTop - this.marginBottom;
    }

    get aspectRatio () {
        return this.innerHeight/this.innerWidth;
    }

    each (callback) {
        this.$scope.$draws.forEach(callback);
    }
    /**
     * Draw the paper
     */
    draw () {
        // Gather draws
        var draws = this.$scope.draw;
        if (draws && !isArray(draws)) draws = [draws];
        if (!draws) return;
        var paper = this;

        draws.forEach( (draw) => {
            if (!isObject(draw)) draw = {marks: draw};
            if (!draw.marks)
                throw Error('Could not draw object, no "marks" specified');
            if (!paper[draw.marks])
                throw Error('Could not draw object, marks "' + draw.marks + '" not available');
            paper[draw.marks](draw);
        });
        this.reDraw();
    }

    reDraw () {
        // Draw plugins
        if (this.broadcast('draw').defaultPrevented) return;
        this.logger.debug('Redraw paper ' + this.name);

        this.$scope.$plugins.forEach((plugin) => {
            if (plugin.active)
                plugin.draw();
        });

        this.$scope.$draws.forEach((d) => {
            d.draw();
        });

        // Finally draw layers (for canvas)
        this.$scope.$layers.each((layer) => {
            layer.draw();
        });
    }

    /**
     * Resize the paper if it needs resizing
     */
    resize (size) {
        var scope = this.$scope;
        if (!size) size = boundingBox(scope);

        if (scope.$size[0] !== size[0] || scope.$size[1] !== size[1]) {
            scope.$size[0] = size[0];
            scope.$size[1] = size[1];
            this.reDraw();
        }
        return this;
    }

    /**
     * Clear the paper by clearing all paper layers
     */
    clear () {
        this.broadcast('clear');
        var container = this.container;
        var first_container = this.element.select('.gt-paper').node();
        var position = container.node() === first_container ? 'relative' : 'absolute';
        container.style("position", position);
        var scope = this.$scope;
        scope.$layers.each(function (layer) {
            layer.clear();
        });
    }

    remove () {
        return this.giotto.remove(this);
    }

    destroy () {
        // remove data listener
        this.on('data.' + this.id, null);
        // destroy plugins
        this.$scope.$plugins.forEach((plugin) => {
            plugin.destroy();
        });
        // destroy draws
        this.$scope.$draws.forEach((d) => {
            d.destroy();
        });
        // remove container
        this.container.remove();
        // finally call super method
        super.destroy();
    }

    scale (name) {
        return this.$scope.$scales.get(name).scale();
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
export class Layer extends GiottoBase {

    constructor (paper, name) {
        super(paper.$scope.$new());
        this.$scope.$name = name;
    }

    get element () {
        return this.paper.container.select('.' + this.name);
    }

    get type () {
        return this.paper.type;
    }

    get factor () {
        return this.paper.factor;
    }

    get context () {
        return null;
    }

    /**
     * Return a d3-selection for this layer
     *
     * @returns {*}
     */
    selection () {
        return this.element;
    }

    transition (name) {
        var fullname = this.name + '.' + name,
            t = this.$scope.$transitions.get(name),
            selection = this.selection();
        if (t) return t.transition(selection, fullname);
        else return selection.transition(fullname).duration(100);
    }

    // Drawing method
    dim (d) {
        return d;
    }

    pen (p) {
        return p;
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

// Internal function for evaluating paper dom size
export function getSize (element, scope) {
    var width = scope.$width;
    var height = scope.$height;

    if (!width) {
        width = size.getWidth(element);
        if (width)
            scope.$elwidth = size.getWidthElement(element);
        else
            width = constants.WIDTH;
    }

    if (!height) {
        height = size.getHeight(element);
        if (height)
            scope.$elheight = size.getHeightElement(element);
        else
            height = constants.HEIGHT;
    }
    // Allow to specify height as a percentage of width
    else if (typeof(height) === "string" && height.indexOf('%') === height.length-1) {
        scope.$heightPercentage = 0.01*parseFloat(height);
        height = round(scope.$heightPercentage*width);
    }

    return [width, height];
}


function boundingBox (scope) {
    var w = scope.$elwidth ? size.getWidth(scope.$elwidth) : scope.$size[0],
        h;
    if (scope.$heightPercentage)
        h = round(w*scope.$heightPercentage, 0);
    else
        h = scope.$elheight ? size.getHeight(scope.$elheight) : scope.$size[1];
    if (scope.$minHeight)
        h = Math.max(h, scope.$minHeight);
    return [round(w), round(h)];
}


function dataListener (paper) {

    return function (e, serie) {
        var redraw = false;

        paper.$scope.$draws.forEach((d) => {
            var from = d.$scope.from;
            if (isArray(from) && from.indexOf(serie.name) > -1)
                redraw = true;
        });

        if (redraw) paper.reDraw();
    };
}
