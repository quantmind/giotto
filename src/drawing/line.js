import {paperDraw, Drawing} from '../core/drawing';


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
        var serie = series[0].copy(),
            //scalex = this.scale(this.$scope.scalex || 'x'),
            //scaley = this.scale(this.$scope.scaley || 'y'),
            group = layer.group(this);

        group
            .select('path')
            .datum(serie);
    }
}


paperDraw(Line, {
    interpolate: 'cardinal',
    lineWidth: 1
});
