    var rgba = d3.canvas.rgba;


    function canvas_implementation (paper, p) {
        var _ = {};

        _.clear = function (group, size) {
            var factor = group.factor(),
                ctx = group.context();
            if (!size) size = p.size;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect (0 , 0, factor*size[0], factor*size[1]);
            return factor;
        };

        _.scale = function (group) {
            return d3.canvas.retinaScale(group.context(), p.size[0], p.size[1]);
        };

        _.resize = function (group, oldsize) {
            _.clear(group, oldsize);
            _.scale(group);
            group.resetAxis().render();
        };

        _.point = canvasPoint;
        _.axis = canvasAxis;
        _.path = canvasPath;
        _.pieslice = canvasSlice;
        _.bar = canvasBar;

        _.points = function () {
            this.each(function () {
                this.reset().render();
            });
        };

        _.barchart = _.points;

        // Pie chart drawing on an canvas group
        _.pie = function (draw) {
            draw.each(function () {
                this.reset().render();
            });
        };

        return _;
    }

    function canvasAxis (group, axis, xy) {
        var d = drawing(group),
            ctx = group.context(),
            opts, size;

        d.render = function (context) {
            context = context || ctx;
            // size of font
            opts = d.options();
            if (opts.show === false) return d;
            size = opts.size;
            opts.size = group.scale(group.dim(size)) + 'px';
            context.font = fontString(opts);
            opts.size = size;
            //
            ctx.strokeStyle = d3.canvas.rgba(d.color, d.colorOpacity);
            context.fillStyle = d.color;
            ctx.lineWidth = group.factor()*d.lineWidth;
            _draw(context);
            context.stroke();
            return d;
        };

        d.context = function (context) {
            ctx = context;
            return d;
        };

        d.inRange = function (ex, ey) {
            return false;
        };

        return d;

        function _draw (context) {
            var x = 0, y = 0;

            context.save();
            opts = d.options();

            if (xy[0] === 'x')
                y = opts.position === 'top' ? 0 : group.innerHeight();
            else
                x = opts.position === 'left' ? 0 : group.innerWidth();
            context.translate(x, y);
            axis(d3.select(context.canvas));
            context.restore();
        }
    }

    function canvasPath (group, data) {
        var d = drawing(group),
            scalex = d.scalex,
            scaley = d.scaley,
            ctx = group.context();

        d.render = function (context) {
            var opts = d.options();
            context = context || ctx;

            if (opts.area) {
                var scaley = group.yaxis().scale();
                if (!d.fill) d.fill = d.color;
                context.fillStyle = d3.canvas.rgba(d.fill, d.fillOpacity);
                d3.canvas.area()
                        .interpolate(opts.interpolate)
                        .x(d.scalex())
                        .y0(scaley(scaley.domain()[0]))
                        .y1(d.scaley())
                        .context(context)(data);
                context.fill();
            }
            ctx.strokeStyle = d.color;
            ctx.lineWidth = group.factor()*d.lineWidth;
            d3.canvas.line()
                .interpolate(opts.interpolate)
                .x(d.scalex())
                .y(d.scaley())
                .context(context)(data);
            context.stroke();
            return d;
        };

        d.context = function (context) {
            ctx = context;
            return d;
        };

        //d.inRange = function (ex, ey) {
        //    _draw(ctx);
        //    return ctx.isPointInPath(ex, ey);
        //};

        return d;
    }

    function canvasPoint (draw, data, size) {
        var d = point(draw, data, size),
            scalex = draw.scalex(),
            scaley = draw.scaley(),
            factor = draw.factor(),
            ctx = draw.group().context();

        d.render = function (context) {
            context = context || ctx;
            context.save();
            _draw(context);
            if (d.fill) {
                context.fillStyle = rgba(d.fill, d.fillOpacity);
                context.fill();
            }
            if (d.color && d.lineWidth) {
                context.strokeStyle = rgba(d.color, d.colorOpacity);
                context.lineWidth = factor*d.lineWidth;
                context.stroke();
            }
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

        return d;

        function _draw (context) {
            if (!draw.symbol)
                draw.symbol = d3.canvas.symbol().type(function (d) {return d.symbol;})
                                                .size(draw.size());
            context.translate(scalex(d.data), scaley(d.data));
            draw.symbol.context(context)(d);
        }
    }

    function canvasBar (draw, data, siz) {
        var d = point(draw, data, siz),
            scalex = draw.scalex(),
            scaley = draw.scaley(),
            size = draw.size(),
            factor = draw.factor(),
            group = draw.group(),
            ctx = draw.group().context(),
            x, y, y0, y1, w, yb, radius;

        d.render = function (context) {
            context = context || ctx;
            context.fillStyle = d3.canvas.rgba(d.fill, d.fillOpacity);
            context.strokeStyle = d3.canvas.rgba(d.color, d.colorOpacity);
            context.lineWidth = factor*d.lineWidth;
            _draw(context);
            context.fill();
            context.stroke();
            return d;
        };

        d.inRange = function (ex, ey) {
            _draw(ctx);
            return ctx.isPointInPath(ex, ey);
        };

        return d;

        function _draw (context) {
            radius = factor*draw.options().radius;
            context.beginPath();
            w = 0.5*size(d);
            x = scalex(d.data);
            y = scaley(d.data);
            y0 = group.scaley(0);
            d3.canvas.drawPolygon(context, [[x-w, y0], [x+w, y0], [x+w, y], [x-w, y]], radius);
            context.closePath();
        }
    }

    function canvasSlice (draw, data) {
        var d = pieSlice(draw, data),
            group = draw.group(),
            factor = draw.factor(),
            ctx = group.context();

        d.render = function (context) {
            context = context || ctx;
            context.save();
            context.translate(0.5*group.innerWidth(), 0.5*group.innerHeight());
            context.fillStyle = rgba(d.fill, d.fillOpacity);
            context.strokeStyle = rgba(d.color, d.colorOpacity);
            context.lineWidth = factor*d.lineWidth;
            draw.arc.context(context)(d);
            context.fill();
            context.stroke();
            context.restore();
            return d;
        };

        d.context = function (context) {
            ctx = context;
            return d;
        };

        d.inRange = function (ex, ey) {
            ctx.save();
            ctx.translate(0.5*group.innerWidth(), 0.5*group.innerHeight());
            draw.arc.context(ctx)(d);
            var res = ctx.isPointInPath(ex, ey);
            ctx.restore();
            return res;
        };

        return d;
    }
