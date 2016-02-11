'use strict';

function getSVGNode (el) {
    if(el.tagName.toLowerCase() === 'svg')
        return el;

    return el.ownerSVGElement;
}

// Given a shape on the screen, will return an SVGPoint for the directions
// n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
// sw(southwest).
//
//    +-+-+
//    |   |
//    +   +
//    |   |
//    +-+-+
//
// Returns an Object {x, y, e, w, nw, sw, ne, se}
export function getScreenBBox (target) {

    var bbox = {},
        matrix = target.getScreenCTM(),
        svg = getSVGNode(target),
        point = svg.createSVGPoint(),
        tbbox = target.getBBox(),
        width = tbbox.width,
        height = tbbox.height;

    point.x = tbbox.x;
    point.y = tbbox.y;
    bbox.nw = point.matrixTransform(matrix);
    point.x += width;
    bbox.ne = point.matrixTransform(matrix);
    point.y += height;
    bbox.se = point.matrixTransform(matrix);
    point.x -= width;
    bbox.sw = point.matrixTransform(matrix);
    point.y -= 0.5*height;
    bbox.w = point.matrixTransform(matrix);
    point.x += width;
    bbox.e = point.matrixTransform(matrix);
    point.x -= 0.5*width;
    point.y -= 0.5*height;
    bbox.n = point.matrixTransform(matrix);
    point.y += height;
    bbox.s = point.matrixTransform(matrix);

    return bbox;
}
