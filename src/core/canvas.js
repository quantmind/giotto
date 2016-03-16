import {Paper, Layer} from './paper';
import {select} from 'd3-selection';
import {default as orderedMap} from '../utils/map';
import {default as canvasSelection, canvasResolution} from '../canvas/index';


class CanvasLayer extends Layer {

    constructor (paper, name) {
        super(paper, name);
        this.$scope.groups = orderedMap();
        var c = paper.container,
            canvas = c.append('canvas').classed('gt-layer', true).classed(name, true),
            node = canvas.node();
        var position = c.select('canvas').node() === node ? 'relative' : 'absolute';
        canvas
            .style('position', position)
            .style('top', 0)
            .style('left', 0);
    }

    /**
     * Return canvas context
     * @returns {CanvasRenderingContext2D}
     */
    get context () {
        return this.element.node().getContext('2d');
    }

    selection () {
        var node = this.$scope.$$canvasNode;
        if (!node) {
            node = canvasSelection(this.context, this.factor).node();
            this.$scope.$$canvasNode = node;
        }
        return select(node);
    }

    /**
     * Canvas transition object
     *
     * @param name: Transition name
     * @returns {*}
     */
    transition (name) {
        return super.transition(name).attrTween('draw', reDraw);
    }

    group () {
        return this.selection().attr(
            'transform', this._translate(this.paper.marginLeft, this.paper.marginTop));
    }

    /**
     * Clear the canvas
     * @returns {CanvasLayer}
     */
    clear () {
        var ctx = this.context,
            width = this.paper.domWidth,
            height = this.paper.domHeight,
            factor = this.factor;

        ctx.beginPath();
        ctx.closePath();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.canvas.width = width;
        ctx.canvas.height = height;

        if (factor != 1) {
            ctx.canvas.style.width = width + "px";
            ctx.canvas.style.height = height + "px";
            ctx.canvas.width = width * window.devicePixelRatio;
            ctx.canvas.height = height * window.devicePixelRatio;
            ctx.scale(factor, factor);
        }
        return this;
    }

    draw () {
        if (this.$scope.$$canvasNode)
            this.selection().attr('draw', 0);
    }

    pen (p) {
        return function () {
            return function () {
                return p;
            };
        };
    }
}

Layer.getFactor = canvasResolution;

Layer.type.canvas = CanvasLayer;


export class Canvas extends Paper {

    constructor (giotto, element, options) {
        super(giotto, element, options);
        var self = this;
        this.on('draw.' + this.id, function (e) {
            if (self.$scope.$isChild(e.$currentScope))
                self.clear();
        });
    }

    get type () {
        return 'canvas';
    }

    destroy () {
        this.on('draw.' + this.id, null);
        return super.destroy();
    }

    /**
     * Return an image for this canvas paper
     *
     * @returns {string}
     */
    image () {
        var target = this.addElement('image'),
            canvas = target.node(),
            ctx = canvas.context();
        canvas.__target = true;

        this.container.selectAll('*').each(function () {
            if (!this.__target) {
                let img = new Image();
                img.src = this.getContext('2d').canvas.toDataURL();
                ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
            }
        });
        var dataUrl = ctx.canvas.toDataURL();
        target.remove();
        return dataUrl;
    }
}


function reDraw () {
    return ping;
}

function ping (t) {
    return t;
}
