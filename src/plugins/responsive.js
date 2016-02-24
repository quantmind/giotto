import {self} from 'd3-quant';
import {select} from 'd3-selection';
import {timer} from 'd3-timer';
import {Plugin} from '../core/paper';


/**
 * An Axis is associated with a given paper as well as a given drawing
 *
 * At most a paper can draw two x-axis and two y-axis
 */
class Responsive extends Plugin {

    constructor (paper, p) {
        super(paper, p);
        p.resizing = false;
        var me = this;
        select(window).on('resize.paper' + paper.id, function () {
            me.resize();
        });
    }

    resize () {
        var p = self.get(this),
            paper = this.paper;

        if (!p.resizing) {
            if (p.delay) {
                p.resizing = true;
                timer(function () {
                    paper.resize();
                    return true;
                }, p.delay);
            } else {
                paper.resize();
            }
        }
    }
}

Plugin.register(Responsive, true, {
    delay: 200
});
