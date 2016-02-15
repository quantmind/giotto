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
}
