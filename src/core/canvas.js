    //
    //  Canvas
    //  ======================
    g.group.canvas = function (paper, p) {

        var container = paper.canvas(true),
            elem = p.before ? container.insert('canvas', p.before) : container.append('canvas'),
            ctx = elem.node().getContext('2d'),
            _ = canvas_implementation(p);

        container.selectAll().style({"position": "absolute", "top": "0", "left": "0"});
        container.select().style({"position": "relative"});

        var group = g.group(paper, elem.node(), p, _).factor(
                d3.canvas.retinaScale(ctx, p.size[0], p.size[1])),
            render = group.render;

        group.render = function () {
            var factor = _.clear(group, p.size);
            ctx.translate(factor*p.margin.left, factor*p.margin.top);
            return render();
        };

        group.context = function () {
            return ctx;
        };

        group.dataAtPoint = function (point, elements) {
            var factor = group.factor(),
                x = factor*point[0],
                y = factor*point[1],
                data;
            group.each(function () {
                this.each(function () {
                    if (this.inRange(x, y)) elements.push(this);
                });
            });
        };

        return group;
    };

    function rgba (color, opacity) {
        if (opacity < 1) {
            var c = d3.rgb(color);
            return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + opacity + ')';
        } else return color;
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
            drawPolygon(context, [[x-w,y0], [x+w,y0], [x+w,y], [x-w, y]], radius);
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


    function drawPolygon (ctx, pts, radius) {
        if (radius > 0)
            pts = getRoundedPoints(pts, radius);
        var i, pt, len = pts.length;
        ctx.beginPath();
        for (i = 0; i < len; i++) {
            pt = pts[i];
            if (i === 0)
                ctx.moveTo(pt[0], pt[1]);
            else
                ctx.lineTo(pt[0], pt[1]);
            if (radius > 0)
                ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
        }
        ctx.closePath();
    }

    function getRoundedPoints(pts, radius) {
        var i1, i2, i3, p1, p2, p3, prevPt, nextPt,
            len = pts.length,
            res = new Array(len);
        for (i2 = 0; i2 < len; i2++) {
            i1 = i2-1;
            i3 = i2+1;
            if (i1 < 0)
                i1 = len - 1;
            if (i3 === len) i3 = 0;
            p1 = pts[i1];
            p2 = pts[i2];
            p3 = pts[i3];
            prevPt = getRoundedPoint(p1[0], p1[1], p2[0], p2[1], radius, false);
            nextPt = getRoundedPoint(p2[0], p2[1], p3[0], p3[1], radius, true);
            res[i2] = [prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1]];
        }
      return res;
    }

    function getRoundedPoint(x1, y1, x2, y2, radius, first) {
        var total = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
            idx = first ? radius / total : (total - radius) / total;
        return [x1 + (idx * (x2 - x1)), y1 + (idx * (y2 - y1))];
    }
