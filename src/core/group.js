
    g.group = function (paper, element, p, _) {
        var drawings = [],
            factor = 1,
            rendering = false,
            resizing = false,
            type = p.type,
            d3v = d3[type],
            scale = d3.scale.linear(),
            events = d3.dispatch.apply(null, g.constants.groupEvents),
            group = giottoMixin(d3.rebind({}, events, 'on'), p);

        element.__group__ = group;
        p = group.options();

        group.type = function () {
            return type;
        };

        group.event = function (name) {
            return events[name] || noop;
        };

        group.element = function () {
            return d3.select(element);
        };

        group.paper = function () {
            return paper;
        };

        // [width, height] in pixels
        group.width = function () {
            return factor*p.size[0];
        };

        group.height = function () {
            return factor*p.size[1];
        };

        group.factor = function (x) {
            if (!arguments.length) return factor;
            factor = +x;
            return group;
        };

        group.size = function () {
            return [group.width(), group.height()];
        };

        group.innerWidth = function () {
            return factor*(p.size[0] - p.margin.left - p.margin.right);
        };

        group.innerHeight = function () {
            return factor*(p.size[1] - p.margin.top - p.margin.bottom);
        };

        group.aspectRatio = function () {
            return group.innerHeight()/group.innerWidth();
        };

        group.marginLeft = function () {
            return factor*p.margin.left;
        };

        group.marginRight = function () {
            return factor*p.margin.right;
        };

        group.marginTop = function () {
            return factor*p.margin.top;
        };

        group.marginBottom = function () {
            return factor*p.margin.bottom;
        };

        group.add = function (draw) {
            if (isFunction(draw)) draw = drawing(group, draw);
            drawings.push(draw);
            return draw;
        };

        group.each = function (callback) {
            for (var i=0; i<drawings.length; ++i)
                callback.call(drawings[i]);
            return group;
        };

        group.render = function () {
            if (rendering) return;
            rendering = true;
            for (var i=0; i<drawings.length; ++i)
                drawings[i].render();
            rendering = false;
            return group;
        };

        group.rendering = function () {
            return rendering;
        };

        // remove this group from the paper or a drawing by name
        group.remove = function (name) {
            if (!arguments.lenght) {
                return group.element().remove();
            }
            var draw;
            for (var i=0; i<drawings.length; ++i) {
                draw = drawings[i];
                if (!name)
                    draw.remove();
                else if (draw.name() === name) {
                    draw.remove();
                    return drawings.splice(i, 1);
                }
            }
            return group;
        };

        group.resize = function (size) {
            resizing = true;
            _.resize(group, size);
            resizing = false;
            return group;
        };

        group.resizing = function () {
            return resizing;
        };

        group.scale = function (r) {
            if (!arguments.length) return scale;
            return scale(r);
        };

        group.fromPX = function (px) {
            return scale.invert(factor*px);
        };

        group.xfromPX = group.fromPX;
        group.yfromPX = group.fromPX;

        group.dim = function (x) {
            if (!x) return 0;

            var v = +x;
            // assume input is in pixels
            if (isNaN(v))
                return group.fromPX(x.substring(0, x.length-2));
            // otherwise assume it is a value between 0 and 1 defined as percentage of the x axis length
            else
                return v;
        };

        return group;
    };
