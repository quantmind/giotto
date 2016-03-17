import {capfirst} from '../utils/index';
import {Plugin} from '../core/plugin';
import {forEach, isObject} from 'd3-quant';
import {map} from 'd3-collection';
import * as d3 from 'd3-ease';


/**
 * Transition plugins are for holding transition configuration parameters.
 *
 * A transition is obtained from a paper layer on behalf of a drawing component
 */
class Transitions extends Plugin {

    constructor (paper, opts, defaults) {
        var transitions = map(),
            options = {};
        forEach(opts, (o, key) => {
            if (isObject(o)) transitions.set(key, o);
            else options[key] = o;
        });
        super(paper, options, defaults);
        var scope = this.$scope;
        scope.transitions = map();
        transitions.each((o, key) => {
            scope.transitions.set(key, scope.$new().$extend(o));
        });
    }
    /**
     * @returns The d3-ease function
     */
    easingFunction (name) {
        var fun = d3['ease' + capfirst(name)];
        if (!fun) throw Error('No such easing function ' + name);
        return fun;
    }

    get (layer, name) {
        var scope = this.$scope,
            cfg = scope.transitions.get(name) || scope,
            fullname = this.paper.name + '.' + layer.name;

        if (name)
            fullname += '.' + name;

        return layer.selection()
                        .transition(fullname)
                        .duration(cfg.duration)
                        .ease(this.easingFunction(cfg.easing));
    }
}


Plugin.register(Transitions, true, {
    duration: 750,
    easing: 'cubic'
});
