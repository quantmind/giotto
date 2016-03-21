import {paperDraw, Drawing} from '../core/drawing';
import {isObject} from 'd3-quant';
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
        var data = series[0].data(),
            scope = this.$scope,
            ys = this.$scope.scaley || 'y',
            x = this.scaled(this.accessor(scope.x), this.$scope.scalex || 'x'),
            y = this.scaled(this.accessor(scope.y), ys),
            //y0 = this.paper.scale(ys).domain()[0],
            //line0 = layer.pen(d3.line().x(x).y(y0)),
            line = d3.line().x(x).y(y).curve(this.curve()),
            merge = layer.transition('update'),
            group = layer.group(this),
            color = scope.color || this.paper.$scope.$colors.pick(),
            path = group.selectAll('path.line').data([data]),
            width = layer.dim(scope.lineWidth);

        this.group = group;
        // make sure color is in scope
        scope.color = color;

        path
            .enter()
                .append('path')
                .attr('class', 'line')
                .attr('fill', 'none')
                .attr('stroke', color)
                .attr('stroke-opacity', 0)
                .attr('stroke-width', width)
            .merge(path)
                .transition(merge)
                .attr('stroke', color)
                .attr('stroke-opacity', scope.colorOpacity)
                .attr('stroke-width', width)
                .attr('d', line);

        path
            .exit()
            .remove();
    }

    curve () {
        var scope = this.$scope,
            curve = scope.curve,
            name = curve;

        if (isObject(name)) name = curve.curve || 'cardinalOpen';
        if (name.substring(0, 5) !== 'curve')
            name = 'curve' + name[0].toUpperCase() + name.substring(1);
        var obj = d3[name];
        if (!obj)
            throw Error('Could not locate curve type "' + name + '"');
        return obj;
    }
}


paperDraw(Line, {
    curve: 'cardinalOpen',
    lineWidth: 1,
    colorOpacity: 1,
    x: 'x',
    y: 'y'
});
