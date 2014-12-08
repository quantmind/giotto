    //
    //  Canvas based Paper
    //  ======================
    //
    g.paper.addType('canvas', function (paper, p) {

        var clear = paper.clear,
            components,
            componentMap,
            cidCounter,
            factor = 1,
            cid = null,
            container = paper.element().append('div')
                            .attr('class', 'canvas-container')
                            .style('position', 'relative');

        p.xAxis = d3.canvas.axis();
        p.yAxis = [d3.canvas.axis(), d3.canvas.axis()];

        paper.destroy = function () {
            _clear();
            return paper;
        };

        paper.refresh = function (size) {
            if (size) {
                var oldsize = p.size;
                p.size = size;
                _apply(function (ctx) {
                    _clearCanvas(ctx, oldsize);
                    _scaleCanvas(ctx);
                });
            }
            paper.render();
            return paper;
        };

        paper.width = function () {
            return factor*p.size[0];
        };

        paper.height = function () {
            return factor*p.size[1];
        };

        paper.innerWidth = function () {
            return factor*(p.size[0] - p.margin.left - p.margin.right);
        };

        paper.innerHeight = function () {
            return factor*(p.size[1] - p.margin.top - p.margin.bottom);
        };

        paper.factor = function (x) {
            if (!arguments.length) return factor;
            factor = +x;
            return paper;
        };

        // Re-render the canvas/es in this paper
        paper.render = function (_cid) {
            if (!arguments.length)
                _apply(_render);
            else
                _apply(_render, _cid);
            return paper;
        };

        paper.clear = function () {
            _clear();
            _addCanvas();
            return clear();
        };

        paper.group = function (attr) {
            var canvas = _addCanvas();
            if (attr)
                canvas.attr(attr);
            return paper.current();
        };

        paper.on = function (event, callback) {
            paper.element().on(event, function () {
                callback.call(this);
            });
            return paper;
        };

        paper.current = function () {
            return cid !== null ? componentMap[cid].canvas.getContext('2d') : null;
        };

        // set the current element to be the root svg element and returns the paper
        paper.root = function () {
            if (components)
                cid = components[0];
            return paper;
        };

        // set the current element to be the parent and returns the paper
        paper.parent = function () {
            var index = components.indexOf(cid);
            cid = Math.max(0, index-1);
            return paper;
        };

        paper.xfromPX = function (px) {
            return p.xAxis.scale().invert(factor*px);
        };

        paper.yfromPX = function (px) {
            return paper.yAxis().scale().invert(factor*px);
        };

        paper.circle = function (cx, cy, r) {
            var ctx = paper.current();
            ctx.beginPath();
            cx = paper.scalex(cx);
            cy = paper.scaley(cy);
            r = paper.scale(r);
            ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
            ctx.endPath();
        };

        paper.drawXaxis = function () {
        };

        paper.drawYaxis = function () {
        };

        // Draw a path or an area
        paper.path = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.line, opts);

            return _addComponent(function (ctx) {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    line = opts.area ? d3.canvas.area() : d3.canvas.line();

                if (!opts.color)
                    opts.color = paper.pickColor();

                ctx.strokeStyle = opts.color;
                ctx.lineWidth = factor*opts.lineWidth;

                line.interpolate(opts.interpolate)
                    .x(function(d) {
                        return scalex(d.x);
                    })
                    .y(function(d) {
                        return scaley(d.y);
                    }).context(ctx)(data);

                ctx.stroke();
            });
        };

        paper.points = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.point, opts);

            return _addComponent(function (ctx) {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    fill = opts.fill,
                    symbol = d3.canvas.symbol().type(function (d) {
                        return d.symbol || opts.symbol;
                    }).size(pointSize(paper, opts)),
                    d, i;

                chartColors(paper, data, opts);

                if (fill === true)
                    opts.fill = fill = d3.rgb(opts.color).brighter();

                for (i=0; i<data.length; ++i) {
                    d = data[i];
                    ctx.save();
                    ctx.translate(scalex(d.x), scaley(d.y));
                    ctx.fillStyle = d.fill || fill;
                    ctx.strokeStyle = d.color || opts.color;
                    ctx.lineWidth = factor*(d.lineWidth || opts.width);
                    symbol(ctx, d, i);
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                }

            });

        };

        paper.barchart = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.point, opts);

            return _addComponent(function (ctx) {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    fill = opts.fill,
                    width = barWidth(paper, data, opts),
                    zero = scaley(0),
                    chart = container.select('g.barchart'),
                    y0 = scaley(0),
                    radius = factor*opts.radius,
                    x, y, d, i;

                for (i=0; i<data.length; ++i) {
                    d = data[i];
                    ctx.beginPath();
                    ctx.fillStyle = d.fill || opts.fill;
                    ctx.strokeStyle = d.color || opts.color;
                    ctx.lineWidth = factor*(d.lineWidth || opts.lineWidth);
                    x = scalex(d.x) - width;
                    y = scaley(d.y);
                    drawPolygon(ctx, [[x,y0], [x+width,y0], [x+width,y], [x, y]], radius);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            });
        };

        paper.pie = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.pie, opts);

            return _addComponent(function (ctx) {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    width = paper.innerWidth(),
                    height = paper.innerHeight(),
                    radius = 0.5*Math.min(width, height),
                    innerRadius = opts.innerRadius*radius,
                    cornerRadius = paper.dim(opts.cornerRadius),
                    pie = d3.layout.pie()
                        .value(function (d, i) {
                            return d.length > 1 ? d[1] : d[0];
                        }),
                        //.padAngle(opts.padAngle),
                    arc = d3.canvas.arc()
                            //.padRadius(radius)
                            .cornerRadius(cornerRadius)
                            .innerRadius(innerRadius)
                            .outerRadius(radius)
                            .context(ctx),
                    arcs = pie(data),
                    j = -1, d;

                ctx.save();
                ctx.translate(width/2, height/2);

                for (var i=0; i<data.length; ++i) {
                    d = data[i];
                    ctx.fillStyle = d.fill || paper.pickColor(++j);
                    ctx.strokeStyle = d.color || paper.pickColor(j, 1);
                    ctx.lineWidth = factor*(d.lineWidth || opts.lineWidth);
                    arc(arcs[i]);
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
            });
        };

        // INTERNALS
        function _clear () {
            components = [];
            componentMap = {};
            cidCounter = 0;
            cid = null;
            container.selectAll('*').remove();
        }

        function _addCanvas() {
            cid = ++cidCounter;

            var canvas = container.append("canvas")
                            .attr("class", "giotto")
                            .attr("id", "giottoCanvas-" + paper.uid() + "-" + cid),
                element = canvas.node(),
                ctx = _scaleCanvas(element.getContext('2d'));

            var component = {
                    cid: cid,
                    canvas: element,
                    callbacks: []
                };

            if (components.length)
                canvas.style({"position": "absolute", "top": "0", "left": "0"});

            components.push(cid);
            componentMap[cid] = component;
            return canvas;
        }

        function _addComponent (callback) {
            componentMap[cid].callbacks.push(callback);
            return cid;
        }

        function _render (ctx, canvas) {
            _clearCanvas(ctx, p.size);
            //
            // translate the axis range
            ctx.translate(factor*p.margin.left, factor*p.margin.top);
            //
            // apply components
            componentMap[cid].callbacks.forEach(function (callback) {
                callback(ctx);
            });
        }

        function _apply (callback, _cid) {
            var current = cid,
                component;
            if (!_cid)
                components.forEach(function (_cid) {
                    cid = _cid;
                    component = componentMap[cid];
                    callback(component.canvas.getContext('2d'), component.canvas);
                });
            else if (componentMap[_cid]) {
                cid = component.cid;
                component = componentMap[cid];
                callback(component.canvas.getContext('2d'), component.canvas);
            }
            cid = current;
        }

        function _clearCanvas(ctx, size) {
            // clear previous stuff
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect (0 , 0, factor*size[0], factor*size[1]);
            return ctx;
        }

        function _scaleCanvas(ctx) {
            factor = d3.canvas.retinaScale(ctx, p.size[0], p.size[1]);
            _reset_axis(paper);
        }

    });


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
