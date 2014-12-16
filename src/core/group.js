
    g.group = function (paper, element, p, _) {
        var drawings = [],
            factor = 1,
            d3v = d3[p.type],
            xaxis = d3v.axis(),
            yaxis = d3v.axis(),
            group = {};

        element.__group__ = group;

        group.element = function () {
            return d3.select(element);
        };

        group.options = function () {
            return p;
        };

        group.xaxis = function () {
            return xaxis;
        };

        group.yaxis = function () {
            return yaxis;
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
            return group.resetAxis();
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

        group.add = function (d) {
            drawings.push(d);
            return d;
        };

        group.each = function (callback) {
            for (var i=0; i<drawings.length; ++i)
                callback.call(drawings[i]);
            return group;
        };

        group.render = function () {
            for (var i=0; i<drawings.length; ++i)
                drawings[i].render();
            return group;
        };

        // remove all drowings of a drawing by name
        group.remove = function (name) {
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
            if (!name) {
                drawings = [];
                group.clear();
            }
            return group;
        };

        // clear the group without removing drawing from memory
        group.clear = function () {
            _.clear(group);
            return group;
        };

        // Draw a path or an area
        group.path = function (data, opts) {
            opts || (opts = {});
            chartColors(paper, copyMissing(p.line, opts));

            return group.add(_.path(group, data)).options(opts);
        };

        // Draw scatter points
        group.points = function (data, opts) {
            opts || (opts = {});
            chartColors(paper, copyMissing(p.point, opts));

            return group.add(_.points(group))
            .options(opts)
            .size(point_size)
            .dataConstructor(point_costructor)
            .data(data);
        };

        // Draw a pie chart
        group.barchart = function (data, opts) {
            opts || (opts = {});
            chartColors(paper, copyMissing(p.bar, opts));

            return group.add(_.barchart(group))
            .options(opts)
            .dataConstructor(bar_costructor)
            .data(data);
        };

        // Draw pie chart
        group.pie = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.pie, opts);

            return group.add(_.pie(group, pie, arc))
            .options(opts)
            .dataConstructor(pie_costructor)
            .data(data);
        };

        // Draw X axis
        group.drawXaxis = function () {
            return group.add(_.axis(group, xaxis, 'x-axis')).options(p.xaxis);
        };

        group.drawYaxis = function () {
            return group.add(_.axis(group, yaxis, 'y-axis')).options(p.yaxis);
        };

        group.scalex = function (x) {
            return xaxis.scale()(x);
        };

        group.scaley = function (y) {
            return yaxis.scale()(y);
        };

        group.scale = function (r) {
            var s = xaxis.scale();
            return Math.max(0, s(r) - s(0));
        };

        group.xfromPX = function (px) {
            return xaxis.scale().invert(factor*px);
        };

        group.yfromPX = function (px) {
            return yaxis.scale().invert(factor*px);
        };

        // dimension in the input domain from a 0 <= x <= 1
        // assume a continuous domain
        // TODO allow for multiple domain points
        group.dim = function (x) {
            var v = +x;
            // assume input is in pixels
            if (isNaN(v))
                return group.xfromPX(x.substring(0, x.length-2));
            // otherwise assume it is a value between 0 and 1 defined as percentage of the x axis length
            else {
                var d = group.xAxis().scale().domain();
                return v*(d[d.length-1] - d[0]);
            }
        };

        // x coordinate in the input domain
        group.x = function (u) {
            var d = xaxis.scale().domain();
            return u*(d[d.length-1] - d[0]) + d[0];
        };

        // y coordinate in the input domain
        group.y = function (u) {
            var d = yaxis.scale().domain();
            return u*(d[d.length-1] - d[0]) + d[0];
        };

        group.resetAxis = function () {
            xaxis.options = function () {return p.xaxis;};
            yaxis.options = function () {return p.yaxis;};

            xaxis.scale().range([0, group.innerWidth()]);
            yaxis.scale().range([group.innerHeight(), 0]);

            [xaxis, yaxis].forEach(function (axis) {
                var o = axis.options(),
                    innerTickSize = group.scale(group.dim(o.tickSize)),
                    outerTickSize = group.scale(group.dim(o.outerTickSize)),
                    tickPadding = group.scale(group.dim(o.tickPadding));
                axis.tickSize(innerTickSize, outerTickSize)
                      .tickPadding(tickPadding)
                      .orient(o.position);

                if (isNull(o.min) || isNull(o.max))
                    o.auto = true;
            });
            return group;
        };

        var

        point_costructor = function (rawdata) {
            // Default point size
            var group = this.group(),
                size = group.scale(group.dim(this.options().size)),
                data = [];

            for (var i=0; i<rawdata.length; i++)
                data.push(_.point(this, rawdata[i], size));
            return data;
        },

        bar_costructor = function (rawdata) {
            var width = barWidth(paper, rawdata, this.options());

            for (var i=0; i<rawdata.length; i++)
                data.push(_.bar(this, rawdata[i], size));

            return data;
        },

        pie_costructor = function (rawdata) {
            var paper = this.paper(),
                group = this.group(),
                opts = this.options(),
                data = [],
                x = this.x(),
                y = this.y(),
                d;

            for (var i=0; i<rawdata.length; i++) {
                d = rawdata[i];
                data.push(_.slice(group, {
                    label: x(d),
                    value: y(d)
                }).options(opts));
                d.draw = _draw;
                data[i] = d.reset();
            }
        };

        return group.resetAxis();
    };
