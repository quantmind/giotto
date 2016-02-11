
    function giotto_id (element) {
        var id = element ? element.attr('id') : null;
        if (!id) {
            id = 'giotto' + (++_idCounter);
            if (element) element.attr('id', id);
        }
        return id;
    }

    function svg_defs (element) {
        var svg = d3.select(getSVGNode(element.node())),
            defs = svg.select('defs');
        if (!defs.size())
            defs = svg.append('defs');
        return defs;
    }

    function getWidth (element) {
        return getParentRectValue(element, 'width');
    }

    function getHeight (element) {
        return getParentRectValue(element, 'height');
    }

    function getWidthElement (element) {
        return getParentElementRect(element, 'width');
    }

    function getHeightElement (element) {
        return getParentElementRect(element, 'height');
    }

    function getParentRectValue (element, key) {
        var parent = element.node ? element.node() : element,
            r, v;
        while (parent && parent.tagName !== 'BODY') {
            v = parent.getBoundingClientRect()[key];
            if (v)
                break;
            parent = parent.parentNode;
        }
        return v;
    }

    function getParentElementRect (element, key) {
        var parent = element.node ? element.node() : element,
            r, v;
        while (parent && parent.tagName !== 'BODY') {
            v = parent.getBoundingClientRect()[key];
            if (v)
                return d3.select(parent);
            parent = parent.parentNode;
        }
    }

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
    function getScreenBBox (target) {

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
