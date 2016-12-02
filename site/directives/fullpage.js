import {window} from 'd3-selection';


export default {
    create (expression) {
        return expression || "true";
    },

    refresh () {
        var height = window(this.el).innerHeight;
        this.sel.style('min-height', height + 'px');
    }
};
