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

    function (group) {
        var type = group.type();

        // Draw points in the group
        group.points = function (data, opts) {
            opts || (opts = {});
            chartFormats(group, opts);
            chartColor(group.paper(), copyMissing(group.options().point, opts));

            return group.add(g[type].points)
                .pointOptions(pointOptions)
                .size(point_size)
                .options(opts)
                .dataConstructor(point_costructor)
                .data(data);
        };
    });


    var SymbolSize = {
            circle: 0.7,
            cross: 0.7,
            diamond: 0.7,
            "triangle-up": 0.6,
            "triangle-down": 0.6
        },

        pointOptions = extendArray(['size', 'symbol'], drawingOptions),

        point_size = function (d) {
            var s = +d.size;
            if (isNaN(s)) {
                var g = d.group();
                s = g.scale(g.xfromPX(d.size.substring(0, d.size.length-2)));
            }
            return s*s*(SymbolSize[d.symbol] || 1);
        },

        point_costructor = function (rawdata) {
            var group = this.group(),
                size = group.scale(group.dim(this.options().size)),
                point = g[group.type()].point,
                data = [];

            for (var i=0; i<rawdata.length; i++)
                data.push(point(this, rawdata[i], size));
            return data;
        };

    g.svg.point = function (draw, data, size) {
        var d = drawingData(draw, data),
            group = draw.group();

        d.set('size', data.size === undefined ? size : data.size);
        d.render = function (element) {
            group.draw(element).attr('d', draw.symbol);
        };
        return d;
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

        var points = pp.selectAll('*').data(this.data());
        points.enter().append('path');
        points.exit().remove();

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
        var d = canvasMixin(drawingData(draw, data)),
            scalex = draw.scalex(),
            scaley = draw.scaley(),
            factor = draw.factor(),
            group = draw.group();

        function symbol () {
            if (!draw.Symbol)
                draw.Symbol = d3.canvas.symbol().type(function (d) {return d.symbol;})
                                                .size(draw.size());
            return draw.Symbol;
        }

        d.set('size', data.size === undefined ? size : data.size);

        d.render = function () {
            return _draw(function (ctx) {
                d3.canvas.style(ctx, d);
                return d;
            });
        };

        d.inRange = function (ex, ey) {
            return _draw(function (ctx) {
                return ctx.isPointInPath(ex, ey);
            });
        };

        d.bbox = function () {
            var x = scalex(d.data) + group.marginLeft(),
                y = scaley(d.data) + group.marginTop(),
                size = Math.sqrt(symbol().size()(d));
            return canvasBBox(d, [x-size, y-size], [x+size, y-size], [x+size, y+size], [x-size, y+size]);
        };

        return d;

        function _draw (callback) {
            var ctx = d.context();
            ctx.save();
            group.transform(ctx);
            ctx.translate(scalex(d.data), scaley(d.data));
            symbol().context(ctx)(d);
            var r = callback(ctx);
            ctx.restore();
            return r;
        }
    };
