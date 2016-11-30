import {window} from 'd3-selection';


export default {
    create (expression) {
        return expression;
    },

    refresh () {
        var height = window(this.el).style('height');
        this.el.style('min-height', height);
    }
};
