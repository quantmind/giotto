import {Paper, Layer} from './paper';


class CanvasLayer extends Layer {

    constructor(paper, name) {
        super(paper, name);
        paper.container
            .append('svg')
            .attr('class', name);
    }

}

Layer.type.svg = CanvasLayer;


export class Svg extends Paper {

    get type () {
        return "svg";
    }

    addElement () {
    }
}
