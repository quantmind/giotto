import {self} from 'd3-quant'
import {getOptions, defaults} from './defaults';
import {Canvas} from './canvas';
import {Svg} from './svg';

/**
 * Giotto class
 *
 * Manage multiple papers objects and coordinate rendering between them
 */
export class Giotto {

    constructor (options) {
        self.set(this, {
            options: getOptions(options, defaults),
            papers: []
        });
    }

    // Create a new paper for a DOM element
    //
    paper (element, options) {
        let paper;
        options = getOptions(options, this.options);
        if (options.type === 'canvas')
            paper = new Canvas(this, element, options);
        else
            paper = new Svg(this, element, options);
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
