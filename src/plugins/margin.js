import {Plugin} from '../core/paper';
import {isObject} from 'd3-quant';

/**
 * Add margin functionality to a paper
 *
 * This plugin is always active
 */
class Margin extends Plugin {

    constructor (paper, value, defaults) {
        if (!isObject(value)) {
            value = value || 0;
            value = {
                left: value,
                right: value,
                top: value,
                bottom: value
            }
        }
        super(paper, value, defaults);
    }
}


Plugin.register(Margin, true, {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
});

