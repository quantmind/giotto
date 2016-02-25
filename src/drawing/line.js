import {paperDraw, Drawing} from '../core/drawing';


/**
 * Draw lines on a paper
 */
class Line extends Drawing {

    /**
     * Draw points on a layer of a paper (usually the drawing layer)
     *
     * @param layer
     */
    draw (layer) {
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


paperDraw(Line, {
    interpolate: 'cardinal',
    lineWidth: 1
});
