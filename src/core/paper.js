'use strict';
import {setOptions} from './options';
import {getElement} from '../utils/dom';
import {extend, isString} from '../utils/object';
import {self, round} from 'd3-quant';

/**
 * A paper is created via a giotto object
 *
 * var g = new Giotto();
 * var p = p.paper();
 */
export class Paper {

    constructor(giotto, element, options) {
        self.set(this, extend(setOptions(options), {
            giotto: giotto,
            element: getElement(element),
            draws: [],
            factor: 1
        }));
    }

    get giotto () {
        return self.get(this).giotto;
    }

    get element () {
        return self.get(this).element;
    }

    get marginLeft () {
        var i = self.get(this);
        return i.factor*pc(i.margin.left, i.size[0]);
    }

    get marginRight () {
        var i = self.get(this);
        return i.factor*pc(i.margin.right, i.size[0]);
    }

    get marginTop () {
        var i = self.get(this);
        return i.factor*pc(i.margin.left, i.size[1]);
    }

    get marginBottom () {
        var i = self.get(this);
        return i.factor*pc(i.margin.bottom, i.size[1]);
    }

    get innerWidth () {
        var i = self.get(this);
        return i.factor*i.size[0] - this.marginLeft - this.marginRight;
    }

    get innerHeight () {
        var i = self.get(this);
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
