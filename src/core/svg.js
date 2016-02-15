import {Paper} from './paper';


export class Svg extends Paper {

    get type () {
        return "svg";
    }

    addElement (element, className) {
        var canvas = element
            .append('div')
            .attr('class', className)
            .style('position', 'relative');
        return canvas;
    }
}
