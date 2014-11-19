    //
    //  SVG Paper
    //  ================
    //
    g.paper.types.svg = function (paper, element, p) {
        var svg = element.append('svg')
                        .attr('width', p.size[0])
                        .attr('height', p.size[1])
                        .attr("viewBox", "0 0 " + p.size[0] + " " + p.size[1]),
            current = svg;

        p.xAxis = d3.svg.axis(),
        p.yAxis = [d3.svg.axis(), d3.svg.axis()];

        // return the current svg element
        paper.current = function () {
            return current;
        };

        // set the current element to be the root svg element and returns the paper
        paper.root = function () {
            current = svg;
            return paper;
        };

        // set the current element to be the parent and returns the paper
        paper.parent = function () {
            if (current !== svg) {
                var parent = current.node().parentNode;
                if (parent === svg.node())
                    return svg;
                else
                    return d3.select(parent);
            }
            return paper;
        };

        paper.group = function () {
            current = current.append('g');
            return current;
        };

        paper.circle = function (cx, cy, r) {
            cx = paper.scalex(cx);
            cy = paper.scaley(cy);
            r = paper.scale(r);
            return current.append('circle')
                            .attr('cx', cx)
                            .attr('cy', cy)
                            .attr('r', r);
        };

        paper.rect = function (x, y, width, height, r) {
            var X = paper.scalex(x),
                Y = paper.scaley(y);
            width = paper.scalex(x+width) - X;
            height = paper.scalex(y+height) - Y;
            var rect = current.append('rect')
                                .attr('x', X)
                                .attr('y', Y)
                                .attr('width', width)
                                .attr('height', height);
            if (r) {
                var rx = paper.scalex(r) - paper.scalex(0),
                    ry = paper.scaley(r) - paper.scaley(0);
                rect.attr('rx', rx).attr('ry', rt);
            }
            return rect;
        };

        paper.path = function (opts) {
            if (isArray(opts)) opts = {data: opts};
            if (!(opts && opts.data)) return;

            copyMissing(this.options.lines, opts);

            var line = d3.svg.line()
                        .interpolate(opts.interpolate)
                        .x(function(d) {
                            return d.x;
                        })
                        .y(function(d) {
                            return d.y;
                        }),
                data = xyData(opts.data);

            return current.append('path')
                            .datum(data)
                            .attr('d', line);
        };
    };