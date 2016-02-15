import {select} from 'd3-selection'
import {extend, isString} from '../utils/object';
import {giottoId, getElement} from '../utils/dom';
import {self, round} from 'd3-quant';

/**
 * A paper is created via a giotto object
 *
 * var g = new Giotto();
 * var p = p.paper();
 */
export class Paper {

    constructor(giotto, element, options, renderer) {
        self.set(this, extend(options, {
            renderer: renderer,
            giotto: giotto,
            element: getElement(element),
            id: giottoId(),
            draws: [],
            factor: 1
        }));
        // Append the paper container
        this.element
            .append('div')
            .attr('id', this.id)
            .classed('gt-paper', true)
            .classed('gt-paper-' + this.type, true);
        this.addElement('gt-background');
        this.addElement('gt-drawings');
        this.addElement('gt-foreground');
    }

    get id () {
        return self.get(this).id;
    }

    get giotto () {
        return self.get(this).giotto;
    }

    get element () {
        return select(self.get(this).element);
    }

    get container () {
        return this.element.select('#' + this.id);
    }

    get backgroundElement () {
        return this.container.select('.gt-background');
    }

    get drawingElement () {
        return this.container.select('.gt-drawings');
    }

    get foregroundElement () {
        return this.container.select('.gt-background');
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
