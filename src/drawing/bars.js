import {Drawing, paperDraw} from '../core/drawing';


/**
 * Draw bars on a paper
 *
 * Grouped bar charts
 * http://bl.ocks.org/mbostock/3887051
 */
class Bars extends Drawing {

    /**
     * Draw a bar chart on a layer of a paper (usually the drawing layer)
     *
     * @param layer
     */
    _draw (layer, series) {
        if (!this.canDraw(layer, series)) return;
        var serie = series[0],
            scope = this.$scope,
            data = serie.data(),
            scalex = this.scale(scope.scalex || 'x'),
            scaley = this.scale(scope.scaley || 'y'),
            x = this.scaled(this.accessor(scope.x || 'x'), scalex),
            y = this.scaled(this.accessor(scope.y || 'y'), scaley),
            merge = layer.transition('update'),
            group = layer.group(this),
            y0 = scaley(0),
            fill = this.color('fill', serie),
            color = this.color('color', serie),
            width = scalex.bandwidth ? scalex.bandwidth() : scope.width;

        var bars = group.selectAll('g.bar')
                        .data(data);

        var enter = bars
                    .enter()
                        .append('g')
                        .attr('class', 'bar');

        enter
            .append('rect')
            .attr('stroke-opacity', 0)
            .attr('fill-opacity', 0)
            .attr('fill', fill)
            .attr('stroke', color)
            .attr('stroke-width', scope.lineWidth);

        enter
            .merge(bars)
            .transition(merge)
            .attr('transform', layer.translate(x, 0))
            .select('rect')
                .attr('width', width)
                .attr('y', function (d) {
                    return Math.min(y0, y(d));
                })
                .attr("height", function (d) {
                    return Math.abs(y(d) - y0);
                })
                .attr('rx', scope.radius)
                .attr('ry', scope.radius)
                .attr('stroke', color)
                .attr('fill', fill)
                .attr('fill-opacity', scope.fillOpacity)
                .attr('stroke-opacity', scope.colorOpacity);

        bars
            .exit()
            .remove();
    }
}


paperDraw(Bars, {
    width: 10,
    fill: true,
    color: '#000',
    fillOpacity: 1,
    colorOpacity: 1,
    lineWidth: 1,
    radius: 2,
    active: {
        fill: 'darker',
        color: 'brighter',
        // Multiplier for size, set to 100% for no change
        size: '150%'
    }
});
