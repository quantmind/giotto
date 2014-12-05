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

        // Re-render on or all the canvas in this paper
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

        paper.on = function (event, callback) {
            paper.element().on(event, function () {
                callback.call(this);
            });
            return paper;
        };

        paper.current = function () {
            return cid !== null ? componentMap[cid].canvas.getContext('2d') : null;
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

        paper.points = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.point, opts);
            opts.color = opts.color || paper.pickColor();

            return _addComponent(function (ctx) {
                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    scale = paper.scale,
                    fill = opts.fill,
                    size = paper.dim(opts.size),
                    d, i;

                if (fill === true)
                    opts.fill = fill = d3.rgb(opts.color).brighter();

                ctx.save();

                if (fill)
                    ctx.fillStyle = fill;

                if (opts.symbol === 'circle') {
                    var PI2 = Math.PI * 2;
                    size *= 0.5;

                    for (i=0; i<data.length; ++i) {
                        d = data[i];
                        ctx.beginPath();
                        ctx.fillStyle = d.fill || fill;
                        ctx.strokeStyle = d.color || opts.color;
                        ctx.lineWidth = d.lineWidth || opts.width;
                        ctx.arc(scalex(d.x), scaley(d.y), scale(d.radius === undefined ? size : d.radius), 0, PI2, false);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }
                } else
                    g.log.error('Not implemented');

                ctx.restore();
            });

        };

        // INTERNALS
        function _clear () {
            components = [];
            componentMap = {};
            cidCounter = 0;
            cid = null;
            container.selectAll('canvas.giotto').remove();
        }

        function _addCanvas() {
            cid = ++cidCounter;

            var canvas = container.append("canvas")
                            .attr("class", "giotto")
                            .attr("id", "giottoCanvas-" + paper.uid() + "-" + cid).node(),
                ctx = _scaleCanvas(canvas.getContext('2d'));

            var component = {
                    cid: cid,
                    canvas: canvas,
                    callbacks: []
                };

            if (components.length)
                canvas.style({"position": "absolute", "top": "0", "left": "0"});

            components.push(component);
            componentMap[cid] = component;
        }

        function _addComponent (callback) {
            componentMap[cid].callbacks.push(callback);
            var o = callback(paper.current());
            if (!o) o = {};
            o.cid = cid;
            o.chart = d3.select(componentMap[cid].canvas);
            return o;
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
            var current = cid;
            if (!_cid)
                components.forEach(function (component) {
                    cid = component.cid;
                    callback(component.canvas.getContext('2d'), component.canvas);
                });
            else if (componentMap[_cid]) {
                var component = omponentMap[_cid];
                cid = component.cid;
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
