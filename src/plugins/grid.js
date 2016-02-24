import {Plugin} from '../core/paper';

/**
 * An Axis is associated with a given paper as well as a given drawing
 *
 * At most a paper can draw two x-axis and two y-axis
 */
class Grid extends Plugin {

}


Plugin.register(Grid, false, {
    layer: 'background',
    fillOpacity: 0.2,
    lineWidth: 0.5,
    xaxis: true,
    yaxis: true
});
