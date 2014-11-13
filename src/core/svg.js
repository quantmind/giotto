
    g.paper.types.svg = function (paper, element, p) {
        var svg = element.append('svg')
                        .attr('width', p.width)
                        .attr('height', p.height)
                        .attr("viewBox", "0 0 " + p.width + " " + p.height),
            current = svg;

        p.xAxis = d3.svg.axis(),
        p.yAxis = [d3.svg.axis(), d3.svg.axis()];

        paper.group = function () {
            current = current.append('g');
            return current;
        };

        paper.circle = function (cx, cy, r) {
            cx = p.scalex(cx);
            cy = p.scaley(cx);
            rx = p.scalex(r);
            return current.append('circle')
                            .attr('cx', cx)
                            .attr('cy', cy)
                            .attr('r', r);
        };

        paper.rect = function (x, y, width, height, r) {
            var rect = current.append('rect')
                                .attr('x', x)
                                .attr('y', y)
                                .attr('width', width)
                                .attr('height', height);
            if (r)
                rect.attr('rx', r).attr('ry', r);
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