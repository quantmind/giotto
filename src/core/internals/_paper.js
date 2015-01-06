
    function _newPaperAttr (element, p) {
        var width, height;

        if (p) {
            if (p.__paper__ === element) return p;
            width = p.width;
            height = p.height;
        }
        else
            p = {};

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

        groupMargins(p);
        copyMissing(g.defaults.paper, p, true);
        paperAxis(p);

        p.size = [width, height];
        p.giotto = 'giotto-group';

        element = d3.select(element);
        var position = element.style('position');
        if (!position || position === 'static')
            element.style('position', 'relative');
        p.__paper__ = element.node();

        return p;
    }

    function groupMargins (opts) {
        if (opts.margin !== undefined && !isObject(opts.margin)) {
            var m = opts.margin;
            opts.margin = {left: m, right: m, top: m, bottom: m};
        }
    }
