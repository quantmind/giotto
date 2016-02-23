import {GiottoBase} from './defaults';

/**
 * Drawing Class
 *
 * A Drawing is paert of a paper and therefore it receive the same updates
 * a paper receive.
 *
 * base class for all drawings
 */
export class Drawing extends GiottoBase {

    /**
     * Draw itself into a paper.layer
     *
     * @param paper
     */
    draw () {
    }
}

Drawing.defaults = {};
