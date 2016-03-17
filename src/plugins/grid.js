import {Plugin} from '../core/plugin';

/**
 * An Grid is associated with a given paper
 *
 * A paper can only have one active grid and the grid can be bound to one or
 * two axes
 */
class Grid extends Plugin {

}


Plugin.register(Grid, false, {
    layer: 'background',
    fillOpacity: 0.2,
    lineWidth: 0.5,
    axes: ['x', 'y']
});
