import * as d3 from 'd3-selection';


class ContextMenu {

    constructor () {
        this.$element = d3.select(document.createElement('div'))
            .attr('class', 'giotto-context-menu')
            .datum(this).node();
        this.$disabled = false;

        this.close();
        document.body.appendChild(this.$element);

        d3.select(document)
            .on('keyup.gmenu', handleKeyUpEvent)
            .on('click.gmenu', handleClickEvent);

        // INTERNALS
        var self = this;

        function handleKeyUpEvent () {
            if (!self.$disabled && self.opened && d3.event && d3.event.keyCode === 27)
                self.close();
        }

        function handleClickEvent () {
            var event = d3.event;
            if (!self.$disabled && self.opened && event && event.button !== 2 || event.target !== self.$element)
                self.close();
        }
    }

    get element () {
        return d3.select(this.$element);
    }

    get opened () {
        return this.element.classed('open');
    }

    open (event, callback) {
        var element = this.element;
        if (!callback(element)) return;

        element.classed('open', true);

        var docLeft = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0),
            docTop = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
            elementWidth = element.node().scrollWidth,
            elementHeight = element.node().scrollHeight,
            docWidth = document.clientWidth + docLeft,
            docHeight = document.clientHeight + docTop,
            totalWidth = elementWidth + event.pageX,
            totalHeight = elementHeight + event.pageY,
            left = Math.max(event.pageX - docLeft, 0),
            top = Math.max(event.pageY - docTop, 0);

        if (totalWidth > docWidth)
            left = left - (totalWidth - docWidth);

        if (totalHeight > docHeight)
            top = top - (totalHeight - docHeight);

        element.style({
            top: top + 'px',
            left: left + 'px',
            position: 'fixed'
        });
        return this;
    }

    close () {
        if (this.opened) {
            this.element.classed('open', false);
        }
        return this;
    }

    register (callback) {
        var self = this;
        return d3.select(document).on('contextmenu.gmenu', function () {
            if (self.$disabled || !callback) return;
            var event = d3.event;
            event.preventDefault();
            event.stopPropagation();
            self.close().open(event, callback);
        });
    }
}


export default function (_) {
    if (arguments.length === 0) return contextMenu;
    contextMenu = _;
}


var contextMenu = function (callback) {
    var menu = d3.select('.giotto-context-menu'),
        node = menu.node();
    menu = node ? menu.datum() : null;
    if (!menu) menu = new ContextMenu();
    menu.register(callback);
    return menu;
}
