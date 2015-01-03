    var rgba = d3.canvas.rgba;


    function canvas_implementation (paper, p) {
        var _ = {};

        _.scale = function (group) {
            return d3.canvas.retinaScale(group.context(), p.size[0], p.size[1]);
        };

        _.resize = function (group) {
            d3.canvas.clear(group.context());
            _.scale(group);
            group.resetAxis().render();
        };

        _.point = canvasPoint;
        _.path = canvasPath;

        _.points = function () {
            this.each(function () {
                this.reset().render();
            });
        };

        return _;
    }

    function canvasPath (group) {
        var d = canvasMixin(pathdraw(group)),
            scalex = d.scalex,
            scaley = d.scaley,
            ctx = group.context(),
            opts, data, active;

        d.render = function (context) {
            opts = d.options();
            data = d.path_data();
            context = context || ctx;

            if (opts.area) {
                var background = group.paper().canvasBackground(true).node().getContext('2d');
                background.save();
                group.transform(background);
                if (!d.fill) d.fill = d.color;
                d.path_area().context(background)(data);

                if (opts.gradient) {
                    var scale = group.yaxis().scale(),
                        domain = scale.domain();
                    g.gradient()
                            .y1(scale(domain[domain.length-1]))
                            .y2(scale(domain[0]))
                            .direction('y')
                            .colors([
                            {
                                color: d3.canvas.rgba(d.fill, d.fillOpacity),
                                offset: 0
                            },
                            {
                                color: d3.canvas.rgba(opts.gradient, d.fillOpacity),
                                offset: 100
                            }])(d3.select(background.canvas));
                } else {
                    background.fillStyle = d3.canvas.rgba(d.fill, d.fillOpacity);
                    background.fill();
                }
                background.restore();
            }
            ctx.strokeStyle = d.color;
            ctx.lineWidth = group.factor()*d.lineWidth;
            d.path_line().context(context)(data);
            context.stroke();
            return d;
        };

        d.context = function (context) {
            ctx = context;
            return d;
        };

        d.inRange = function (ex, ey) {
            var opts = d.options();
            if (!d.active) return false;
            if(!d.active.symbol) return false;
            if (!active)
                active = canvasPoint(d, [], 0);
            var dd = d.bisect(ex - group.marginLeft());
            if (dd) {
                active.data = dd.data;
                return active;
            }
            return false;
        };

        return d;
    }

    function canvasPoint (draw, data, size) {
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
    }
