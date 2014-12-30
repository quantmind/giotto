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
        _.axis = canvasAxis;
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

    function canvasMixin(d) {
        d.inRange = function () {};
        d.bbox = function () {};
        return d;
    }

    function canvasAxis (group, axis, xy) {
        var d = canvasMixin(drawing(group)),
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

    function canvasBar (draw, data, siz) {
        var d = canvasMixin(point(draw, data, siz)),
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
        var d = canvasMixin(pieSlice(draw, data)),
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

    function canvasBBox (d, nw, ne, se, sw) {
        var target = d.paper().element().node(),
            bbox = target.getBoundingClientRect(),
            p = [bbox.left, bbox.top],
            f = 1/d3.canvas.pixelRatio;
        return {
            nw: {x: f*nw[0] + p[0], y: f*nw[1] + p[1]},
            ne: {x: f*ne[0] + p[0], y: f*ne[1] + p[1]},
            se: {x: f*se[0] + p[0], y: f*se[1] + p[1]},
            sw: {x: f*sw[0] + p[0], y: f*sw[1] + p[1]},
            n: {x: av(nw, ne, 0), y: av(nw, ne, 1)},
            s: {x: av(sw, se, 0), y: av(sw, se, 1)},
            e: {x: av(se, ne, 0), y: av(se, ne, 1)},
            w: {x: av(sw, nw, 0), y: av(sw, nw, 1)}
        };

        function av(a, b, i) {return p[i] + 0.5*f*(a[i] + b[i]);}
    }