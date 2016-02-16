import {GiottoBase} from './defaults';
import {self} from 'd3-quant';

/**
 * Drawing Class
 *
 * A Drawing is paert of a paper and therefore it receive the same updates
 * a paper receive.
 *
 * base class for all drawings
 */
export class Drawing extends GiottoBase {

    get data () {
        return self.get(this).data;
    }

    /**
     * Draw itself into a paper
     *
     * @param paper
     */

    draw () {
    }
}

Drawing.defaults = {};
