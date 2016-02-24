import {stackOrderNone, stackOffsetNone} from 'd3-shape';
import {StackedDrawing, paperDraw} from '../core/drawing';


/**
 * Draw area charts on a paper
 *
 * Area is plotted in the background layer, while lines are plotted in the
 * front layer, unless specified otherwise in the options
 * (set background to false)
 * http://bl.ocks.org/mbostock/3887051
 */
class Area extends StackedDrawing {

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


paperDraw(Area, {
    stackOrder: stackOrderNone,
    stackOffset: stackOffsetNone,
    fillOpacity: 0.7,
    colorOpacity: 1,
    lineWidth: 1,
    background: true
});
