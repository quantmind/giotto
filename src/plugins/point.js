    // Scapper point chart
    g.paper.plugin('point', {
        symbol: 'circle',
        size: '8px',
        fill: true,
        fillOpacity: 1,
        colorOpacity: 1,
        lineWidth: 2,
        active: {
            fill: 'darker',
            color: 'brighter',
            // Multiplier for size, set to 100% for no change
            size: '150%'
        },
        transition: extend({}, g.defaults.transition)
    },

    function (group, p) {
        var type = group.type();

        // Draw scatter points
        group.points = function (data, opts) {
            opts || (opts = {});
            chartFormats(group, opts);
            chartColor(group.paper(), copyMissing(p.point, opts));

            return group.add(g[type].points)
                .size(point_size)
                .options(opts)
                .dataConstructor(point_costructor)
                .data(data);
        };
    });


    var point_costructor = function (rawdata) {
        // Default point size
        var group = this.group(),
            size = group.scale(group.dim(this.options().size)),
            point = g[group.type()].point,
            data = [];

        for (var i=0; i<rawdata.length; i++)
            data.push(point(this, rawdata[i], size));
        return data;
    };

    g.svg.point = function (draw, data, size) {
        var p = point(draw, data, size),
            group = draw.group();

        p.render = function (element) {
            group.draw(element).attr('d', draw.symbol);
        };
        return p;
    };

    g.svg.points = function () {
        var group = this.group(),
            pp = group.element().select("#" + this.uid()),
            scalex = this.scalex(),
            scaley = this.scaley(),
            data = this.data();

        this.symbol = d3.svg.symbol().type(function (d) {return d.symbol;})
                                     .size(this.size());

        if (!pp.node()) {
            pp = group.element().append('g').attr('id', this.uid());
            this.remove = function () {
                pp.remove();
            };
        }

        var points = pp.selectAll('*');
        if (data.length != points.length) {
            points.remove();
            points = pp.selectAll('*')
                    .data(this.data())
                    .enter()
                    .append('path');
        }
        group.events(group.draw(points
                 .attr("transform", function(d) {
                     return "translate(" + scalex(d.data) + "," + scaley(d.data) + ")";
                 })
                 .attr('d', this.symbol)));

        return pp;
    };

    g.canvas.points = function () {
        this.each(function () {
            this.reset().render();
        });
    };

    g.canvas.point = function (draw, data, size) {
        var d = canvasMixin(point(draw, data, size)),
            scalex = draw.scalex(),
            scaley = draw.scaley(),
            factor = draw.factor(),
            group = draw.group(),
            ctx = draw.group().context();

        function symbol () {
            if (!draw.symbol)
                draw.symbol = d3.canvas.symbol().type(function (d) {return d.symbol;})
                                                .size(draw.size());
            return draw.symbol;
        }

        d.render = function (context) {
            context = context || ctx;
            context.save();
            _draw(context);
            d3.canvas.style(context, d);
            context.restore();
            return d;
        };

        d.context = function (context) {
            ctx = context;
            return d;
        };

        d.inRange = function (ex, ey) {
            ctx.save();
            _draw(ctx);
            var res = ctx.isPointInPath(ex, ey);
            ctx.restore();
            return res;
        };

        d.bbox = function () {
            var x = scalex(d.data) + group.marginLeft(),
                y = scaley(d.data) + group.marginTop(),
                size = Math.sqrt(symbol().size()(d));
            return canvasBBox(d, [x-size, y-size], [x+size, y-size], [x+size, y+size], [x-size, y+size]);
        };

        return d;

        function _draw (context) {
            context.translate(scalex(d.data), scaley(d.data));
            symbol().context(context)(d);
        }
    };
