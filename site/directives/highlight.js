import {select} from 'd3-selection';


export default {

    create (expression) {
        return expression || 'true';
    },

    refresh () {
        var el = this.el;

        require(['/highlight.js'], function (hljs) {
            highlight(hljs, el);
        });
    }
};


function highlight (hljs, elem) {
    select(elem).selectAll('code').selectAll(function () {
        if (this.parentNode.tagName === 'PRE') {
            hljs.highlightBlock(this);
            select(this.parentNode).classed('hljs', true);
        } else {
            select(this).classed('hljs inline', true);
        }
    });

    select(elem).selectAll('.highlight pre').selectAll(function () {
        var div = this.parentNode,
            parent = div ? div.parentNode : null;

        select(this).classed('hljs', true);

        if (parent && parent.className.substring(0, 10) === 'highlight-')
            select(div).classed('language-' + parent.className.substring(10), true);

        hljs.highlightBlock(this);
    });
}
