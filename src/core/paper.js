'use strict';
import {setOptions} from './options';
import {getElement} from '../utils/dom';
import {inner, extend, isString} from '../utils/object';
import {default as round} from 'd3-interpolate/src/round';

/**
 * A paper is created via a giotto object
 *
 * var g = new Giotto();
 * var p = p.paper();
 */
export class Paper {

    constructor(giotto, element, options) {
        this._inner = extend(setOptions(options), {
            giotto: giotto,
            element: getElement(element),
            draws: []
        });
    }

    get giotto () {
        return inner(this).giotto;
    }

    get element () {
        return inner(this).element;
    }

    get marginLeft () {
        var i = inner(this);
        return i.factor*pc(i.margin.left, i.size[0]);
    }

    get marginRight () {
        var i = inner(this);
        return i.factor*pc(i.margin.right, i.size[0]);
    }

    get marginTop () {
        var i = inner(this);
        return i.factor*pc(i.margin.left, i.size[1]);
    }

    get marginBottom () {
        var i = inner(this);
        return i.factor*pc(i.margin.bottom, i.size[1]);
    }

    get innerWidth () {
        var i = inner(this);
        return i.factor*i.size[0] - this.marginLeft - this.marginRight;
    }

    get innerHeight () {
        var i = inner(this);
        return i.factor*i.size[1] - this.marginTop - this.marginBottom;
    }

    get aspectRatio () {
        return this.innerHeight/this.innerWidth;
    }
}


function pc (margin, size) {
    if (isString(margin) && margin.indexOf('%') === margin.length-1)
        margin = round(0.01*parseFloat(margin)*size, 5);
    return margin;
}
