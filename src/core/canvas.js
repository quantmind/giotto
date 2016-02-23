import {Paper, Layer} from './paper';


class CanvasLayer extends Layer {

    constructor (paper, name) {
        super(paper, name);
        paper.container
            .append('canvas')
            .attr('class', name)
            .style({"position": "absolute", "top": "0", "left": "0"});
    }

    context () {
        return this.element.node().getContext('2d');
    }

    startDraw (center) {
        var ctx = this.context,
            paper = this.paper;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(paper.marginLeft(), paper.marginTop());
        if (center)
            ctx.translate(center[0], center[1]);
    }

    draw () {}

    endDraw () {
        this.context.restore();
    }
}

Layer.type.canvas = CanvasLayer;


export class Canvas extends Paper {

    get type () {
        return "canvas";
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

/**
 * Animation for canvas papers
 *
 */
