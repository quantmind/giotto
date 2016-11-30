import {select, window} from 'd3-selection';


export default {

    create (expression) {
        return expression;
    },

    refresh () {
        var el = this.el;

        require(['highlight'], function () {
            highlight(el);
        });
    }
};


function highlight (elem) {
    select(elem).selectAll('code').selectAll(highlightBlock);
    select(elem).selectAll('.highlight pre').selectAll(highlightSphinx);
}


function highlightBlock () {
    var elem = select(this),
        parent = elem.parent();

    parent.classed('hljs', true);
    if (parent.tagName === 'PRE') {
        window.hljs.highlightBlock(this);
        parent.classed('hljs', true);
    } else {
        elem.classed('hljs inline', true);
    }
}


function highlightSphinx () {
    var elem = select(this),
        div = elem.parent(),
        parent = div.parent().node();

    elem.classed('hljs', true);

    if (parent && parent.className.substring(0, 10) === 'highlight-')
        div.classed('language-' + parent.className.substring(10), true);
    window.hljs.highlightBlock(this);
}
