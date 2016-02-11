'use strict';
import {Giotto} from './main';

/**
 * Create a new Paper for Giotto
 *
 * @param options
 */
Giotto.prototype.create = function (element) {
    var paper = new Paper(this, element);
    this.papers.push(paper);
    return paper;
};

export class Paper {
    constructor(giotto, element) {
        this.gt = giotto;
        this.element = element;
    }
}
