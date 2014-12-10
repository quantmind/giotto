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

        // Return the container of canvas elements
        paper.container = function () {
            return container;
        };

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

        paper.each = function (callback) {
            _apply(callback);
            return paper;
        };

        // Re-render the canvas/es in this paper
        paper.render = function (ctx) {
            arguments.length ? _apply(_render, ctx) : _apply(_render);
            return paper;
        };

        paper.clear = function (ctx) {
            if (ctx)
                _clearCanvas(ctx, p.size);
            else {
                _clear();
                _addCanvas();
                return clear();
            }
            return paper;
        };

        // Create a new canvas element and add it to thecanvas container
        // Returns the new canvas Element
        paper.group = function (attr) {
            var canvas = _addCanvas();
            if (attr)
                canvas.attr(attr);
            paper.render(cid);
            return paper.current();
        };

        paper.on = function (event, callback) {
            container.on(event, function () {
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

        paper.get = function (x) {
            if (x) {
                if (x.node)
                    x = x.node();
                if (x && x.getContext)
                    x = x.getContext('2d');
                if (x)
                    return componentMap[x.__cid__ ? x.__cid__ : x];
            }
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

        paper.getDataAtPoint = function (point) {
            var x = factor*point[0],
                y = factor*point[1],
                data = [];
            _apply(function (ctx, _, component) {
                component.data.forEach(function (el) {
                    if (el.inRange(x, y))
                        data.push(el);
                });
            });
            return data;
        };

        // Draw a path or an area
        paper.path = function (data, opts) {
            opts || (opts = {});
            chartColors(paper, copyMissing(p.line, opts));

            return _addComponent(function (ctx) {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    line = opts.area ? d3.canvas.area() : d3.canvas.line();

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
            data = data.slice();  // copy
            copyMissing(p.point, chartColors(paper, opts));

            var symbol = d3.canvas.symbol().type(function (d) {return d.symbol;})
                                           .size(function (d) {return d.size();}),
                pass = 0;

            return _addComponent(function (ctx) {

                var size = paper.scale(paper.dim(opts.size)),
                    d;


                for (var i=0; i<data.length; ++i) {
                    if (!pass)
                        data[i] = _addData(canvasPoint(paper, opts, ctx, data[i], symbol));
                    data[i].size(size).reset().draw();
                }

                pass++;
            });

        };

        paper.barchart = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.bar, chartColors(paper, opts));

            return _addComponent(function (ctx) {

                var width = barWidth(paper, data, opts),
                    d;

                for (var i=0; i<data.length; i++) {
                    d = canvasBar(paper, opts, ctx, data[i]);
                    d.size(width);
                    _addData(d.reset().draw());
                }
            });
        };

        paper.pie = function (data, opts) {
            opts || (opts = {});
            data = data.slice(); // copy
            copyMissing(p.pie, opts);

            var arc, i;

            return _addComponent(function (ctx) {

                if (!arc) {
                    arc = d3.canvas.arc();
                    for (i=0; i<data.length; i++)
                        data[i] = canvasSlice(paper, opts, ctx, data[i], arc);
                }

                var width = paper.innerWidth(),
                    height = paper.innerHeight(),
                    radius = 0.5*Math.min(width, height),
                    innerRadius = opts.innerRadius*radius,
                    cornerRadius = paper.scale(paper.dim(opts.cornerRadius)),
                    pie = d3.layout.pie().value(function (d, i) {return d.value;})
                                         .padAngle(d3_radians*opts.padAngle)(data),
                    d, dd;

                arc = arc.cornerRadius(cornerRadius)
                        .innerRadius(innerRadius)
                        .outerRadius(radius)
                        .context(ctx);

                for (i=0; i<pie.length; ++i) {
                    d = pie[i];
                    dd = d.data;
                    delete d.data;
                    extend(dd, d);
                    _addData(dd.reset().draw());
                }
            });
        };

        paper.removeCanvas  = function (c) {
            c = paper.get(c);
            if (c) {
                delete componentMap[c.cid];
                var index = components.indexOf(c.cid);
                if (index > -1)
                    return components.splice(index, 1)[0];
                return c.canvas;
            }
        };

        // Download
        paper.downloadPNG = function () {
            var canvas = _addCanvas(),
                context = paper.current();

            _apply(function (ctx) {
                if (ctx !== context)
                    ctx.drawImage(context, 0, 0);
            });
            var dataUrl = context.toDataURL();
            return dataUrl;
        };

        paper.download = paper.downloadSVG;

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

            ctx.__cid__ = cid;
            var component = {
                    cid: cid,
                    canvas: element,
                    callbacks: [],
                    data: [],
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

        function _render (ctx) {
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
                    callback(component.canvas.getContext('2d'), component.canvas, component);
                });
            else {
                component = paper.get(_cid);
                if (component) {
                    cid = component.cid;
                    callback(component.canvas.getContext('2d'), component.canvas, component);
                }
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
            return ctx;
        }

        function _addData (d) {
            componentMap[cid].data.push(d);
            return d;
        }

    });

    function rgba (color, opacity) {
        if (opacity < 1) {
            var c = d3.rgb(color);
            return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + opacity + ')';
        } else return color;
    }

    function canvasPoint (paper, opts, ctx, d, symbol) {
        var scalex = paper.scalex,
            scaley = paper.scaley,
            factor = paper.factor();

        d = paperData(paper, opts, {values: d});

        d.draw = function (context) {
            context = context || ctx;
            context.save();
            context.fillStyle = rgba(d.fill, d.fillOpacity);
            context.strokeStyle = rgba(d.color, d.colorOpacity);
            context.lineWidth = factor*d.lineWidth;
            context.translate(scalex(d.values.x), scaley(d.values.y));
            symbol.context(context)(d);
            context.fill();
            context.stroke();
            context.restore();
            return d;
        };

        d.inRange = function (ex, ey) {
            ctx.save();
            ctx.translate(scalex(d.values.x), scaley(d.values.y));
            symbol.context(ctx)(d);
            var res = ctx.isPointInPath(ex, ey);
            ctx.restore();
            return res;
        };

        return d;
    }

    function canvasBar (paper, opts, ctx, d) {
        var scalex = paper.scalex,
            scaley = paper.scaley,
            factor = paper.factor(),
            radius = factor*opts.radius,
            x, y, y0, y1, w, yb;

        d = paperData(paper, opts, {values: d});

        d.draw = function (context) {
            context = context || ctx;
            context.beginPath();
            context.fillStyle = rgba(d.fill, d.fillOpacity);
            context.strokeStyle = rgba(d.color, d.colorOpacity);
            context.lineWidth = factor*d.lineWidth;
            w = 0.5*d.size();
            x = scalex(d.values.x);
            y = scaley(d.values.y);
            y0 = scaley(0);
            drawPolygon(context, [[x-w,y0], [x+w,y0], [x+w,y], [x-w, y]], radius);
            context.closePath();
            context.fill();
            context.stroke();
            return d;
        };

        d.inRange = function (ex, ey) {
            ctx.beginPath();
            drawPolygon(ctx, [[x-w,y0], [x+w,y0], [x+w,y], [x-w, y]], radius);
            ctx.closePath();
            return ctx.isPointInPath(ex, ey);
        };

        return d;
    }

    function canvasSlice (paper, opts, ctx, d, arc) {
        var scalex = paper.scalex,
            scaley = paper.scaley,
            factor = paper.factor();

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

        d.inRange = function (ex, ey) {
            ctx.save();
            ctx.translate(0.5*paper.innerWidth(), 0.5*paper.innerHeight());
            arc.context(ctx)(d);
            var res = ctx.isPointInPath(ex, ey);
            ctx.restore();
            return res;
        };

        return d;
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
