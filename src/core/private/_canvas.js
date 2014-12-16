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

        _.points = function (group) {
            return drawing(group, function () {
                this.each(function () {
                    this.render();
                });
            });
        };

        _.barchart = _.points;

        _.pie = _.points;

        // Download
        _.image = function () {
            var canvas = _addCanvas().node(),
                context = paper.current(),
                img;

            _apply(function (ctx) {
                if (ctx !== context) {
                    img = new Image();
                    img.src = ctx.canvas.toDataURL();
                    context.drawImage(img, 0, 0, p.size[0], p.size[1]);
                }
            });
            var dataUrl = canvas.toDataURL();
            paper.removeCanvas(canvas);
            return dataUrl;
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
            size = opts.size;
            opts.size = group.scale(group.dim(size)) + 'px';
            context.font = fontString(opts);
            opts.size = size;
            //
            ctx.strokeStyle = d.color;
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
            context = context || ctx;
            ctx.strokeStyle = d.color;
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
            _draw(ctx);
            return ctx.isPointInPath(ex, ey);
        };

        return d;

        function _draw (context) {
            var opts = d.options(),
                line = opts.area ? d3.canvas.area() : d3.canvas.line();

            line.interpolate(opts.interpolate)
                .x(d.scalex())
                .y(d.scaley())
                .context(context)(data);
        }
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
            context.fillStyle = rgba(d.fill, d.fillOpacity);
            context.strokeStyle = rgba(d.color, d.colorOpacity);
            context.lineWidth = factor*d.lineWidth;
            _draw(context);
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

    function canvasBar (draw, opts, d) {
        var scalex = paper.scalex,
            scaley = paper.scaley,
            factor = paper.factor(),
            radius = factor*opts.radius,
            ctx = draw.group().context(),
            x, y, y0, y1, w, yb;

        d = paperData(paper, opts, {data: d});

        d.context = function (context) {
            ctx = context;
            return d;
        };

        d.draw = function (context) {
            context = context || ctx;
            context.fillStyle = rgba(d.fill, d.fillOpacity);
            context.strokeStyle = rgba(d.color, d.colorOpacity);
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

        return d.reset();

        function _draw (context) {
            context.beginPath();
            w = 0.5*d.size();
            x = scalex(d.data.x);
            y = scaley(d.data.y);
            y0 = scaley(0);
            d3.canvas.drawPolygon(context, [[x-w,y0], [x+w,y0], [x+w,y], [x-w, y]], radius);
            context.closePath();
        }
    }

    function canvasSlice (paper, opts, d, arc) {
        var scalex = paper.scalex,
            scaley = paper.scaley,
            factor = paper.factor(),
            ctx;

        d = pieData(paper, opts, d);

        d.draw = function (context) {
            context = context || ctx;
            context.save();
            context.translate(0.5*paper.innerWidth(), 0.5*paper.innerHeight());
            context.fillStyle = rgba(d.fill, d.fillOpacity);
            context.strokeStyle = rgba(d.color, d.colorOpacity);
            context.lineWidth = factor*d.lineWidth;
            arc.context(context)(d);
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
            ctx.translate(0.5*paper.innerWidth(), 0.5*paper.innerHeight());
            arc.context(ctx)(d);
            var res = ctx.isPointInPath(ex, ey);
            ctx.restore();
            return res;
        };

        return d.reset();
    }
