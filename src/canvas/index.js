import {CanvasElement} from './element';
import * as d3 from 'd3-selection';


export default function (context) {
    var selection = d3.selection();
    selection._groups[0][0] = new CanvasElement(context);
    return selection;
}
