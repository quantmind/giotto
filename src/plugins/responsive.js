import {select} from 'd3-selection';
import {timer} from 'd3-timer';
import {Plugin} from '../core/plugin';


/**
 * An Axis is associated with a given paper as well as a given drawing
 *
 * At most a paper can draw two x-axis and two y-axis
 */
class Responsive extends Plugin {

    constructor (paper, opts, defaults) {
        super(paper, opts, defaults);
        var self = this;
        this.$scope.$resizing = false;
        select(window).on('resize.paper' + paper.id, function () {
            self.resize();
        });
    }

    resize () {
        var scope = this.$scope,
            paper = this.paper;

        if (!scope.$resizing) {
            if (scope.delay) {
                scope.$resizing = true;
                timer(function () {
                    paper.resize();
                    scope.$resizing = false;
                    return true;
                }, scope.delay);
            } else
                paper.resize();
        }
    }

    destroy () {
        // remove resizing event for this paper
        select(window).on('resize.paper' + this.paper.id, null);
        super.destroy();
    }
}

Plugin.register(Responsive, true, {
    delay: 200
});
