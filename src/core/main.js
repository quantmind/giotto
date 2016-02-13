'use strict';
import {setOptions} from './options';
import {Paper} from './paper';

/**
 * Giotto class
 *
 * Manage multiple papers objects and coordinate rendering between them
 */
export class Giotto {

    constructor (options) {
        this._inner = {
            options: setOptions(options, Giotto.defaults),
            papers: []
        }
    }

    create (element, options) {
        var paper = new Paper(this, element, options);
        this._inner.papers.push(paper);
        return paper;
    }
}

export default function (options) {
    return new Giotto(options);
}
