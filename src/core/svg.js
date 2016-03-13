import {Paper, Layer} from './paper';


class SvgLayer extends Layer {

    constructor(paper, name) {
        super(paper, name);
        paper.container
            .append('svg')
            .attr('class', name);
    }

    clear () {
        this.element.selectAll('*').remove();
        return this;
    }

    draw () {

    }

    group (draw) {
        return this.element.selectAll('#' + draw.id)
                            .data([draw])
                            .enter()
                            .append('g')
                            .attr('id', draw.id);
    }

}

Layer.type.svg = SvgLayer;


export class Svg extends Paper {

    get type () {
        return "svg";
    }
}
