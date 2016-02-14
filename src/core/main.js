'use strict';
import {self} from 'd3-quant'
import {setOptions} from './options';
import {Paper} from './paper';

/**
 * Giotto class
 *
 * Manage multiple papers objects and coordinate rendering between them
 */
export class Giotto {

    constructor (options) {
        self.set(this, {
            options: setOptions(options, giotto.defaults),
            papers: []
        });
    }

    create (element, options) {
        var paper = new Paper(this, element, options);
        self.get(this).papers.push(paper);
        return paper;
    }

    get options () {
        return self.get(this).options;
    }

    get papers () {
        return self.get(this).papers.slice();
    }
}

export function giotto (options) {
    return new Giotto(options);
}
