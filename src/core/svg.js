import {Paper, Layer} from './paper';


class SvgLayer extends Layer {

    constructor(paper, name) {
        super(paper, name);
        var svg = paper.container
                       .append('svg')
                        .classed('gt-layer', true).classed(name, true),
            node = svg.node();
        var position = paper.container.select('svg').node() === node ? 'relative' : 'absolute';
        svg
            .style('position', position)
            .style('top', 0)
            .style('left', 0);
    }

    clear () {
        this.element.style('width', this.paper.domWidth).style('height', this.paper.domHeight);
        return this;
    }

    draw () {

    }

    dim (d) {
        return d+'px';
    }

    group (draw) {
        var group = this.element.selectAll('#' + draw.id).data([draw]);

        return group
                .enter()
                    .append('g')
                    .attr('id', draw.id)
                .merge(group)
                    .attr('transform', this._translate(this.paper.marginLeft, this.paper.marginTop));
    }
}

Layer.type.svg = SvgLayer;
SvgLayer.getFactor = function () {
    return 1;
}


export class Svg extends Paper {

    get type () {
        return "svg";
    }
}
