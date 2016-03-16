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
        var element = this.element;
        element.selectAll('*').remove();
        element.style('width', this.paper.domWidth).style('height', this.paper.domHeight);
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
                .merge(group)
                .attr('id', draw.id)
                .attr('transform', "translate(" + this.paper.marginLeft + "," + this.paper.marginTop + ")");
    }

    translate (x, y) {
        return function (d) {
            return "translate(" + x(d) + "," + y(d) + ")";
        };
    }
}

Layer.type.svg = SvgLayer;


export class Svg extends Paper {

    get type () {
        return "svg";
    }
}
