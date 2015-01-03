
    g.group = function (paper, element, p, _) {
        var drawings = [],
            factor = 1,
            rendering = false,
            resizing = false,
            type = p.type,
            d3v = d3[type],
            scale = d3.scale.linear(),
            group = {};

        element.__group__ = group;

        group.type = function () {
            return type;
        };

        group.element = function () {
            return d3.select(element);
        };

        group.options = function () {
            return p;
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

        // remove all drawings or a drawing by name
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

        // Draw a path or an area
        group.path = function (data, opts) {
            opts || (opts = {});
            chartFormats(group, opts);
            chartColor(paper, copyMissing(p.line, opts));

            return group.add(_.path(group)).size(point_size).data(data).options(opts);
        };

        // Draw scatter points
        group.points = function (data, opts) {
            opts || (opts = {});
            chartFormats(group, opts);
            chartColor(paper, copyMissing(p.point, opts));

            return group.add(_.points)
            .size(point_size)
            .options(opts)
            .dataConstructor(point_costructor)
            .data(data);
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

        // dimension in the input domain from a 0 <= x <= 1
        // assume a continuous domain
        // TODO allow for multiple domain points
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

        var point_costructor = function (rawdata) {
            // Default point size
            var group = this.group(),
                size = group.scale(group.dim(this.options().size)),
                data = [];

            for (var i=0; i<rawdata.length; i++)
                data.push(_.point(this, rawdata[i], size));
            return data;
        };

        return group;
    };
