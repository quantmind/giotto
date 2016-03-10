import {self} from 'd3-quant';
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
    _draw (layer) {
        var serie = this.data(),
            x = serie.x(),
            y = serie.y(),
            symbol = this.symbol().context(layer.context());
        this.data().forEach((d) => {
            layer.startDraw([x(d), y(d)]);
            layer.draw(symbol(d));
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
