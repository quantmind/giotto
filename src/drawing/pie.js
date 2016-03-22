import {paperDraw, Drawing} from '../core/drawing';
import * as d3 from 'd3-shape';

const pi = Math.PI;
const rad = pi/180;

/**
 * Draw points on a paper
 */
class Pie extends Drawing {

    /**
     * Draw points on a layer of a paper (usually the drawing layer)
     *
     * @param layer
     */
    _draw (layer, series) {
        if (!this.canDraw(layer, series)) return;

        var data = series[0].data(),
            scope = this.$scope,
            group = layer.group(this),
            rscale = this.scale(scope.rscale || 'r'),
            cscale = scope.colorscale || 'color',
            value = scope.y || 'y',
            innerRadius = this.scaled(this.accessor(scope.innerRadius), rscale),
            outerRadius = this.scaled(this.accessor(scope.outerRadius), rscale),
            cornerRadius = this.scaled(this.accessor(scope.cornerRadius), rscale),
            fill = this.scaled(this.accessor(scope.fill || 'value'), cscale),
            update = layer.transition('update'),
            width = layer.dim(scope.lineWidth),
            //labels = this.accessor(scope.labels || 'x'),
            pie = d3.pie()
                .padAngle(rad*scope.padAngle)
                .startAngle(rad*scope.startAngle)
                .value(this.accessor(value)),
            arcs = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .cornerRadius(cornerRadius),
            slices = group
                .attr("transform", this.translate(this.width/2, this.height/2))
                .selectAll('.slice').data(pie(data));

        slices
            .enter()
                .append('path')
                .attr('class', 'slice')
                .attr('stroke', scope.color)
                .attr('stroke-opacity', 0)
                .attr('fill-opacity', 0)
                .attr('fill', fill)
                .attr('stroke-width', width)
            .merge(slices)
                .transition(update)
                .attr('stroke', scope.color)
                .attr('stroke-opacity', scope.colorOpacity)
                .attr('d', arcs)
                .attr('fill', fill)
                .attr('fill-opacity', scope.fillOpacity);

        slices.exit().remove();
    }
}


paperDraw(Pie, {
    colorOpacity: 1,
    fillOpacity: 1,
    padAngle: 0,
    cornerRadius: 0,
    innerRadius: 0,
    outerRadius: 1,
    startAngle: 0,
    lineWidth: 1,
    active: {
        fill: 'darker',
        color: 'brighter',
        //innerRadius: 100%,
        //outerRadius: 105%,
        fillOpacity: 1
    },
    tooltip: {
        template: "<p><strong><%=x%></strong> <%=y%></p>"
    },
    labels: {
        show: true,
        position: 'ouside',
        outerRadius: 1.05,
        color: '#333',
        colorOpacity: 0.5,
        lineWidth: 1
    }
});
