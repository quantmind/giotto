import {select} from 'd3-selection';
import {timer} from 'd3-timer';
import {Plugin} from '../core/paper';


/**
 * An Axis is associated with a given paper as well as a given drawing
 *
 * At most a paper can draw two x-axis and two y-axis
 */
class Responsive extends Plugin {

    constructor (paper, opts, defaults) {
        super(paper, opts, defaults);
        this.resizing = false;
        var self = this;
        select(window).on('resize.paper' + paper.id, function () {
            self.resize();
        });
    }

    resize () {
        var self = this,
            paper = self.paper;

        if (!self.resizing) {
            if (self.delay) {
                self.resizing = true;
                timer(function () {
                    paper.resize();
                    self.resizing = false;
                    return true;
                }, self.delay);
            } else {
                paper.resize();
            }
        }
    }
}

Plugin.register(Responsive, true, {
    delay: 200
});
