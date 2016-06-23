import {Plugin} from '../core/plugin';
import {PaperBase} from '../core/defaults';
import {fontProperties} from 'd3-canvas-transition';

const empty = {};


PaperBase.prototype.font = function (selection) {
    return this.paper.$scope.$font.apply(selection, this.$scope.font || empty);
};


class Font extends Plugin {

    apply (selection , font) {
        let key, v;
        for (let i=0; i<fontProperties.length; ++i) {
            key = fontProperties[i];
            v = font[key] || this.$scope[key];
            if (v)
                selection.style('font-' + key, v);
        }
        return selection;
    }
}


Plugin.register(Font, false, {
    size: 11,
    weight: 'normal',
    style: "normal",
    family: "sans-serif",
    variant: "small-caps"
});
