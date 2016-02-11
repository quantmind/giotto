'use strict';
import {setOptions} from './options';
import {getElement} from '../utils/dom'

/**
 * Create a new Paper for Giotto
 *
 * @param options
 */


export class Paper {

    constructor(giotto, element, options) {
        this._inner = {
            giotto: giotto,
            element: getElement(element),
            options: setOptions(options),
            draws: []
        }
    }

    get giotto () {
        return this._inner.giotto;
    }

    get element () {
        return this._inner.element;
    }
}
