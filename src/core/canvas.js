import {Paper} from './paper';


export class Canvas extends Paper {

    get type () {
        return "canvas";
    }

    addElement (className) {
        this.container
            .append('canvas')
            .attr('class', className)
            .style({"position": "absolute", "top": "0", "left": "0"});
    }

    /**
     * Draw data into this canvas paper
     *
     * @param data
     */
    draw () {

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
