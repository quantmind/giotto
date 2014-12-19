
    function _newPaperAttr (element, p) {
        var width, height;

        if (p) {
            if (p.__paper__ === element) return p;
            width = p.width;
            height = p.height;
        }
        else
            p = {};

        copyMissing(g.defaults.paper, p, true);

        if (isFunction (p.colors))
            p.colors = p.colors(d3);

        if (!width) {
            width = getWidth(element);
            if (width)
                p.elwidth = getWidthElement(element);
            else
                width = g.constants.WIDTH;
        }

        if (!height) {
            height = getHeight(element);
            if (height)
                p.elheight = getHeightElement(element);
            else
                height = g.constants.HEIGHT;
        }
        else if (typeof(height) === "string" && height.indexOf('%') === height.length-1) {
            p.height_percentage = 0.01*parseFloat(height);
            height = d3.round(p.height_percentage*width);
        }

        // Inherit axis properties
        copyMissing(p.font, p.xaxis);
        copyMissing(p.xaxis, p.yaxis);
        copyMissing(p.yaxis, p.yaxis2);

        p.size = [width, height];
        p.giotto = 'giotto-group';

        p.__paper__ = d3.select(element).style('position', 'relative').node();

        return p;
    }
