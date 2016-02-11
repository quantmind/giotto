    //
    // Utility function to calculate paper dimensions and initialise the
    // paper options
    function _paperSize (element, p) {
        var width, height;

        if (isObject(element)) {
            p = element;
            element = null;
        }
        if (element && isFunction(element.node))
            element = element.node();
        if (!element)
            element = document.createElement('div');

        if (p) {
            if (p.__paper__ === element) return p;
            width = p.width;
            height = p.height;
        }
        else
            p = {};

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

        p.size = [width, height];
        p.giotto = 'giotto-group';

        element = d3.select(element);
        var position = element.style('position');
        if (!position || position === 'static')
            element.style('position', 'relative');
        p.__paper__ = element.node();

        return p;
    }
