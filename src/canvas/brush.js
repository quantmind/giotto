
    d3.canvas.brush = function() {
        var rangex = null,
            rangey = null,
            resizes = d3_svg_brushResizes[0],
            inner = d3.svg.brush(),
            rect = [0,0,0,0],
            draw_;

        function brush(canvas) {
            canvas.each(function () {
                d3.select(this)
                    //.style("pointer-events", "all")
                    //.style("-webkit-tap-highlight-color", "rgba(0,0,0,0)")
                    .on("mousedown.brush", Brushstart)
                    .on("touchstart.brush", Brushstart)
                    .on("mousemove.brushover", Brushover);
                redraw(this.getContext('2d'));
            });
        }

        function draw (ctx) {
            var x = inner.x(),
                y = inner.y(),
                extent = inner.extent(),
                x0, y0;

            ctx.beginPath();

            if (x & y) {
                x0 = x(extent[0][0]);
                y0 = y(extent[1][0]);
            }
            else if (x) {
                x0 = x(extent[0]);
                ctx.rect(x0 + rect[0], rect[1], x(extent[1])-x0, rect[3] || ctx.canvas.height);
            }
            else if (y)
                ctx.rect(0, extent[0][0], ctx.canvas.width, extent[0][1]-extent[0][0]);
        }

        function redraw (ctx) {
            draw(ctx);
            if (draw_) draw_(ctx);
        }

        function Brushover () {
            var target = this,
                ctx = target.getContext('2d'),
                origin = d3.mouse(target),
                factor = window.devicePixelRatio || 1;
            draw(ctx);
            if (ctx.isPointInPath(factor*origin[0], factor*origin[1]))
                d3.select(target).style('cursor', 'move');
            else
                d3.select(target).style('cursor', 'crosshair');
        }

        function Brushstart() {
            var target = this,

                eventTarget = d3.select(d3.event.target),
                event_ = event.of(target, arguments),
                canvas = d3.select(target),
                resizing = eventTarget.datum(),
                resizingX = !/^(n|s)$/.test(resizing) && x,
                resizingY = !/^(e|w)$/.test(resizing) && y,
                dragging = eventTarget.classed("extent"),
                dragRestore = d3_event_dragSuppress(),
                center,
                origin = d3.mouse(target),
                offset;

            var w = d3.select(d3_window)
                .on("keydown.brush", keydown)
                .on("keyup.brush", keyup);

            if (d3.event.changedTouches) {
                w.on("touchmove.brush", brushmove).on("touchend.brush", brushend);
            } else {
                w.on("mousemove.brush", brushmove).on("mouseup.brush", brushend);
            }

            // Interrupt the transition, if any.
            canvas.interrupt().selectAll("*").interrupt();

            // If the extent was clicked on, drag rather than brush;
            // store the point between the mouse and extent origin instead.
            if (dragging) {
                origin[0] = xExtent[0] - origin[0];
                origin[1] = yExtent[0] - origin[1];
            }

            // If a resizer was clicked on, record which side is to be resized.
            // Also, set the origin to the opposite side.
            else if (resizing) {
                var ex = +/w$/.test(resizing),
                ey = +/^n/.test(resizing);
                offset = [xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1]];
                origin[0] = xExtent[ex];
                origin[1] = yExtent[ey];
            }

            // If the ALT key is down when starting a brush, the center is at the mouse.
            else if (d3.event.altKey) center = origin.slice();

            // Propagate the active cursor to the body for the drag duration.
            g.style("pointer-events", "none").selectAll(".resize").style("display", null);
            d3.select("body").style("cursor", eventTarget.style("cursor"));

            // Notify listeners.
            event_({type: "brushstart"});
            brushmove();

            function keydown() {
                if (d3.event.keyCode == 32) {
                    if (!dragging) {
                        center = null;
                        origin[0] -= xExtent[1];
                        origin[1] -= yExtent[1];
                        dragging = 2;
                    }
                    d3_eventPreventDefault();
                }
            }

            function keyup() {
                if (d3.event.keyCode == 32 && dragging == 2) {
                    origin[0] += xExtent[1];
                    origin[1] += yExtent[1];
                    dragging = 0;
                    d3_eventPreventDefault();
                }
            }

            function brushmove() {
                var point = d3.mouse(target),
                moved = false;

                // Preserve the offset for thick resizers.
                if (offset) {
                    point[0] += offset[0];
                    point[1] += offset[1];
                }

                if (!dragging) {

                    // If needed, determine the center from the current extent.
                    if (d3.event.altKey) {
                        if (!center) center = [(xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2];

                        // Update the origin, for when the ALT key is released.
                        origin[0] = xExtent[+(point[0] < center[0])];
                        origin[1] = yExtent[+(point[1] < center[1])];
                    }

                    // When the ALT key is released, we clear the center.
                    else center = null;
                }

                // Update the brush extent for each dimension.
                if (resizingX && move1(point, x, 0)) {
                    redrawX(g);
                    moved = true;
                }
                if (resizingY && move1(point, y, 1)) {
                    redrawY(g);
                    moved = true;
                }

                // Final redraw and notify listeners.
                if (moved) {
                    redraw(g);
                    event_({type: "brush", mode: dragging ? "move" : "resize"});
                }
            }

            function move1(point, scale, i) {
                var range = d3_scaleRange(scale),
                r0 = range[0],
                r1 = range[1],
                position = origin[i],
                extent = i ? yExtent : xExtent,
                size = extent[1] - extent[0],
                min,
                max;

                // When dragging, reduce the range by the extent size and position.
                if (dragging) {
                r0 -= position;
                r1 -= size + position;
                }

                // Clamp the point (unless clamp set to false) so that the extent fits within the range extent.
                min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];

                // Compute the new extent bounds.
                if (dragging) {
                max = (min += position) + size;
                } else {

                // If the ALT key is pressed, then preserve the center of the extent.
                if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));

                // Compute the min and max of the position and point.
                if (position < min) {
                max = min;
                min = position;
                } else {
                max = position;
                }
                }

                // Update the stored bounds.
                if (extent[0] != min || extent[1] != max) {
                if (i) yExtentDomain = null;
                else xExtentDomain = null;
                extent[0] = min;
                extent[1] = max;
                return true;
                }
            }

            function brushend() {
                brushmove();

                // reset the cursor styles
                g.style("pointer-events", "all").selectAll(".resize").style("display", brush.empty() ? "none" : null);
                d3.select("body").style("cursor", null);

                w .on("mousemove.brush", null)
                .on("mouseup.brush", null)
                .on("touchmove.brush", null)
                .on("touchend.brush", null)
                .on("keydown.brush", null)
                .on("keyup.brush", null);

                dragRestore();
                event_({type: "brushend"});
            }
        }

        brush.draw = function (_) {
            if (!arguments.length) return draw_;
            draw_ = d3_functor(_);
            return brush;
        };

        brush.extent = function (_) {
            if (!arguments.length) return inner.extent();
            inner.extent(_);
            return brush;
        };

        brush.x = function(z) {
            if (!arguments.length) return inner.x();
            resizes = d3_svg_brushResizes[!inner.x(z).x() << 1 | !inner.y()]; // fore!
            return brush;
        };

        brush.y = function(z) {
            if (!arguments.length) return inner.y();
            resizes = d3_svg_brushResizes[!inner.x() << 1 | !inner.y(z).y()]; // fore!
            return brush;
        };

        brush.rect = function (_) {
            if (!arguments.length) return rect;
            rect = _;
            return brush;
        };

        brush.clamp = function(z) {
            if (!arguments.length) return inner.clamp();
            inner.clamp(z);
            return brush;
        };

        brush.clear = function() {
            inner.clear();
            return brush;
        };

        brush.empty = inner.empty;

        return d3.rebind(brush, inner, "on");

    };
