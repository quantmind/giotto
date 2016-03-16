import {Plugin} from '../core/plugin';
import {rangeFunctions} from './scales';

/**
 * Add support for colors
 */
class Colors extends Plugin {

    constructor (paper, opts, defaults) {
        super(paper, opts, defaults);
        var scope = this.$scope,
            range = scope.range,
            scale = rangeFunctions.get(range) || rangeFunctions.get('category10');
        scope.$colorIndex = 0;
        scope.$range = scale(this).range();
    }

    pick (index) {
        var scope = this.$scope;
        if (arguments.length === 0)
            index = scope.$colorIndex++;

        if (index >= scope.$range.length)
            scope.$colorIndex = index = 0;

        return scope.$range[index];
    }

}


Plugin.register(Colors, true, {
    range: 'category10'
});
