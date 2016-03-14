import {paperDraw, Drawing} from '../core/drawing';
import * as d3 from 'd3-shape';


/**
 * Draw lines on a paper
 */
class Line extends Drawing {

    /**
     * Draw line from a serie
     *
     * @param layer
     */
    _draw (layer, series) {
        if (!this.canDraw(layer, series)) return;
        var serie = series[0],
            scope = this.$scope,
            x = this.scaled(serie.x(), this.$scope.scalex || 'x'),
            y = this.scaled(serie.y(), this.$scope.scaley || 'y'),
            line = d3.line().x(x).y(y),
            group = layer.group(this),
            color = scope.color || this.paper.pickColor(),
            path = group.selectAll('path').data([serie.dataArray]);

        // make sure color is in scope
        scope.color = color;

        group
            .select('path')
            .datum(serie.dataArray);

        layer.drawSelections(
            path
                .enter()
                .append('path')
                .merge(path)
                //.transition()
                .style('fill', 'none')
                .style('stroke-width', scope.lineWidth)
                .style('stroke', color)
                .style('stroke-opacity', scope.colorOpacity)
                .attr('d', line)
        );
    }
}


paperDraw(Line, {
    interpolate: 'cardinal',
    lineWidth: 1,
    colorOpacity: 1
});
