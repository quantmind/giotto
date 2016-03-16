import {symbol} from 'd3-shape';
import {paperDraw, Drawing} from '../core/drawing';


/**
 * Draw points on a paper
 */
class Points extends Drawing {

    /**
     * Get or set the point symbol generator
     *
     * A symbol is implemented d3-shape and contain information
     * about size and type
     */
    symbol (_) {
        if (!arguments.length) return self.get(this).symbol;
        self.get(this).symbol = _;
        return this;
    }

    /**
     * Draw points on a layer
     *
     * @param layer
     */
    _draw (layer, series) {
        if (!this.canDraw(layer, series)) return;
        var serie = series[0],
            scope = this.$scope,
            merge = layer.transition('merge'),
            x = this.scaled(serie.x(), this.$scope.scalex || 'x'),
            y = this.scaled(serie.y(), this.$scope.scaley || 'y'),
            group = layer.group(this);

        var sym = layer.pen(symbol()),
            points = group.selectAll('path.' + this.id).data(serie.dataArray);

        points
            .enter()
                .append('path')
                .classed(this.id, true)
                .attr('transform', layer.translate(x, y))
                .style('fill-opacity', 0)
            .merge(points)
                .transition(merge)
                .attr('transform', layer.translate(x, y))
                .style('fill', '#ccc')
                .style('fill-opacity', scope.fillOpacity)
                .attr('d', sym);

        points
            .exit()
            //.transition(this.exitTransition())
            .remove();
    }
}


paperDraw(Points, {
    symbol: 'circle',
    size: '8px',
    fill: true,
    fillOpacity: 1,
    colorOpacity: 1,
    lineWidth: 2,
    active: {
        fill: 'darker',
        color: 'brighter',
        // Multiplier for size, set to 100% for no change
        size: '150%'
    }
});
