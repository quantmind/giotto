import {self} from 'd3-quant';
import {dispatch} from 'd3-dispatch';
import {getOptions, defaults, GiottoBase} from './defaults';
import {Canvas} from './canvas';
import {Svg} from './svg';
import {rebind} from '../utils/object';

/**
 * Giotto class
 *
 * Manage multiple papers objects and coordinate rendering between them
 */
export class Giotto  extends GiottoBase {

    constructor (options) {
        super(getOptions(options, defaults));
        var g = self.get(this);
        g.papers = [];
        g.events = dispatch('draw', 'redraw', 'dataBefore', 'data');
        rebind(this, g.events, 'on');
    }

    /**
     *
     * @returns {Array.<Object>} a copy of the array of papers
     */
    get papers () {
        return self.get(this).papers.slice();
    }

    /**
     * Set or get data from this instance
     *
     * @param series: when provided it is the serie data
     * @returns this when setting, serie data when getting
     */
    data (series) {
        var gt = self.get(this);
        if (arguments.length === 1) {
            var events = gt.events;
            events.call('dataBefore', this, series);
            gt.data = series;
            gt.papers.forEach((p) => {
                p.data(series);
            });
            events.call('data', this);
            return this;
        } else {
            return gt.data;
        }
    }

    /**
     * Create a new paper for a DOM element
     *
     * @return a new Paper object
     */
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

    /**
     * Apply ``callback`` over all papers
     *
     * @param callback: function accepting the paper as first parameter
     */
    forEach (callback) {
        self.get(this).papers.forEach(callback);
    }

    /**
     * Draw data into this giotto instance
     *
     * @param data
     */
    draw (data) {
        this.clear();
        this.forEach((paper) => {
            paper.draw(data);
        });
    }

    clear () {
        this.forEach((paper) => {
            paper.clear();
        });
    }
}

export function giotto (options) {
    return new Giotto(options);
}
