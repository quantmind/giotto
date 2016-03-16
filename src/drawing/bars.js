import {stackOrderNone, stackOffsetNone} from 'd3-shape';
import {StackedDrawing, paperDraw} from '../core/drawing';


/**
 * Draw bars on a paper
 *
 * Grouped bar charts
 * http://bl.ocks.org/mbostock/3887051
 */
class Bars extends StackedDrawing {

    /**
     * Draw points on a layer of a paper (usually the drawing layer)
     *
     * @param layer
     */
    _draw (layer, series) {
        var serie = series[0],
            scope = this.$scope,
            merge = layer.transition('merge'),
            ys = this.$scope.scaley || 'y',
            x = this.scaled(serie.x(), this.$scope.scalex || 'x'),
            y = this.scaled(serie.y(), ys),
            group = layer.group(this);

        var bars = group.selectAll('rect.' + this.id).data(serie.dataArray);

        bars
            .enter()
                .append('rect')
                .classed(this.id, true)
                .style('fill-opacity', 0)
            .merge(bars)
                .transition(merge)
                .attr('transform', layer.translate(x, y))
                .style('fill', '#ccc')
                .style('fill-opacity', scope.fillOpacity);

        bars
            .exit()
            .remove();
    }
}


paperDraw(Bars, {
    stackOrder: stackOrderNone,
    stackOffset: stackOffsetNone,
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
