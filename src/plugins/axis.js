import {Plugin} from '../core/paper';

/**
 * An Axis is associated with a given paper as well as a given drawing
 *
 * At most a paper can draw two x-axis and two y-axis
 */
class Axis extends Plugin {

}


Plugin.register(Axis, false, {
    tickSize: '6px',
    outerTickSize: '6px',
    tickPadding: '3px',
    lineWidth: 1,
    textRotate: 0,
    textAnchor: null
});

