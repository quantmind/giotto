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
     * Draw points on a layer of a paper (usually the drawing layer)
     *
     * @param layer
     */
    draw (layer) {
        if (arguments.length === 0)
            layer = this.paper.drawings;

        var self = this,
            series = this.getSeries();

        this.on('data', function (e, serie) {
            if (self.$scope.from.indexOf(serie.name) > -1)
                self._draw(layer, this.getSeries());
        });

        this._draw(layer, series);
    }

    _draw (layer, series) {
        if (!this.canDraw(layer, series)) return;
        var serie = series[0].copy();

        var x = serie.x(),
            y = serie.y(),
            s = symbol().context(layer.context);
        serie.forEach((d) => {
            layer.startDraw([x(d), y(d)]);
            layer.draw(s(d));
            layer.endDraw();
        });
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
