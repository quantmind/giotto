import {easeLinear, easeQuadIn, easeQuadOut} from 'd3-ease';
import {Plugin} from '../core/plugin';

var easing = {
    'linear': easeLinear,
    'quadIn': easeQuadIn,
    'quadOut': easeQuadOut
};


class Transitions extends Plugin {

    /**
     * @returns The d3-ease function
     */
    get easingFunction () {
        var fun = easing[this.$scope.easing];
        if (!fun) fun = easing['linear'];
        return fun;
    }

    transition (selection, name) {
        var scope = this.$scope;
        name = this.paper.name + '.' + name;
        return selection.transition(name).duration(scope.duration).ease(this.easingFunction);
    }
}

Plugin.register(Transitions, true, {
    name: 'transitions.merge',
    duration: 750,
    easing: 'quadIn'
});

Plugin.register(Transitions, true, {
    name: 'transitions.exit',
    duration: 750,
    easing: 'quadOut'
});

