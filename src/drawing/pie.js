import {self} from 'd3-quant';
import {paperDraw, Drawing} from '../core/drawing';


/**
 * Draw points on a paper
 */
class Pie extends Drawing {

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


paperDraw(Pie, {
    padAngle: 0,
    cornerRadius: 0,
    innerRadius: 0,
    startAngle: 0,
    active: {
        fill: 'darker',
        color: 'brighter',
        //innerRadius: 100%,
        //outerRadius: 105%,
        fillOpacity: 1
    },
    tooltip: {
        template: "<p><strong><%=x%></strong> <%=y%></p>"
    },
    labels: {
        show: true,
        position: 'ouside',
        outerRadius: 1.05,
        color: '#333',
        colorOpacity: 0.5,
        lineWidth: 1
    }
});
