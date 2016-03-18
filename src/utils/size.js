import {select} from 'd3-canvas-transition';


export function getWidth (element) {
    var el = getParentElementRect(element, 'width');
    if (el) return elementWidth(el);
}

export function getHeight (element) {
    var el = getParentElementRect(element, 'width');
    if (el) return elementHeight(el);
}

export function getWidthElement (element) {
    return getParentElementRect(element, 'width');
}

export function getHeightElement (element) {
    return getParentElementRect(element, 'height');
}

function elementWidth (el) {
    var w = el.getBoundingClientRect()['width'],
        s = select(el),
        left = padding(s.style('padding-left')),
        right = padding(s.style('padding-right'));
    return w - left - right;
}

function elementHeight (el) {
    var w = el.getBoundingClientRect()['height'],
        s = select(el),
        top = padding(s.style('padding-top')),
        bottom = padding(s.style('padding-bottom'));
    return w - top - bottom;
}

function getParentElementRect (element, key) {
    let parent = element.node ? element.node() : element,
        v;
    while (parent && parent.tagName !== 'BODY') {
        v = parent.getBoundingClientRect()[key];
        if (v)
            return parent;
        parent = parent.parentNode;
    }
}

function padding (value) {
    if (value && value.substring(value.length-2) == 'px')
        return +value.substring(0, value.length-2);
    return 0;
}
