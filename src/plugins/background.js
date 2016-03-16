import {Plugin} from '../core/plugin';
import {default as gradient} from '../core/gradient';
import {isObject} from 'd3-quant';

/**
 * A plugin for the background of a paper
 */
class Background extends Plugin {

    constructor (paper, opts, defaults) {
        if (opts && !isObject(opts)) opts = {color: opts};
        super(paper, opts, defaults);
    }

    draw () {
        var paper = this.paper,
            grad = gradient(this.$scope);
        grad.xscale.range([0, paper.width]);
        grad.yscale.range([0, paper.height]);

        grad.draw(paper.background);
    }
}


Plugin.register(Background, false, {
    color: '#fff'
});
