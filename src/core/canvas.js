import {Paper, Layer} from './paper';
import {orderedMap} from 'd3-quant';
import * as canvas from 'd3-canvas-transition';


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
            node = canvas.selection(this.context, this.factor);
            this.$scope.$$canvasNode = node;
        }
        return node;
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
}

Layer.getFactor = canvas.resolution;

Layer.type.canvas = CanvasLayer;


export class Canvas extends Paper {

    get type () {
        return 'canvas';
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
