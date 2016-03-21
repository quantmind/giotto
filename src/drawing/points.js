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
            data = serie.data(),
            scope = this.$scope,
            merge = layer.transition('update'),
            x = this.scaled(this.accessor(scope.x), scope.scalex || 'x'),
            y = this.scaled(this.accessor(scope.y), scope.scaley || 'y'),
            size = this.accessor(scope.size),
            fill = this.color(scope.fill, serie),
            group = layer.group(this);

        var sym = symbol().size(size),
            points = group.selectAll('path.points').data(data);

        points
            .enter()
                .append('path')
                .attr('class', 'points')
                .attr('transform', layer.translate(x, y))
                .attr('fill', fill)
                .attr('fill-opacity', 0)
            .merge(points)
                .transition(merge)
                .attr('transform', layer.translate(x, y))
                .attr('fill', fill)
                .attr('fill-opacity', scope.fillOpacity)
                .attr('d', sym);

        points
            .exit()
            //.transition(this.exitTransition())
            .remove();
    }

    color (color, serie) {
        if (color === true) color = this.paper.$scope.$colors.pick();
        return this.accessor(color, serie.fields);
    }
}


paperDraw(Points, {
    symbol: 'circle',
    fill: true,
    fillOpacity: 1,
    colorOpacity: 1,
    lineWidth: 2,
    x: 'x',
    y: 'y',
    size: 60,
    active: {
        fill: 'darker',
        color: 'brighter',
        // Multiplier for size, set to 100% for no change
        size: '150%'
    }
});
