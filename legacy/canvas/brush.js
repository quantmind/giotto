
    d3.canvas.brush = function() {
        var event = d3.dispatch("brushstart", "brush", "brushend"),
            x = null, // x-scale, optional
            y = null, // y-scale, optional
            xExtent = [0, 0], // [x0, x1] in integer pixels
            yExtent = [0, 0], // [y0, y1] in integer pixels
            xExtentDomain, // x-extent in data space
            yExtentDomain, // y-extent in data space
            xClamp = true, // whether to clamp the x-extent to the range
            yClamp = true, // whether to clamp the y-extent to the range
            resizes = d3_svg_brushResizes[0],
            rect = [0, 0, 0, 0], // specify a rectangle in the canvas where to limit the extent
            factor = window.devicePixelRatio || 1,
            p = 3*factor,
            fillStyle,
            draw_sn,
            draw_we;

        function brush(canvas) {

            canvas.each(function () {
                d3.select(this)
                    .style("pointer-events", "all")
                    .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)")
                    .on("mousedown.brush", Brushstart)
                    .on("touchstart.brush", Brushstart)
                    .on("mousemove.brushover", Brushover);
                event.brushstart.call(this);
                event.brush.call(this);
                event.brushend.call(this);
                brushfill(this.getContext('2d'));
            });
        }

        function brushfill (ctx) {
            if (fillStyle) {
                draw(ctx);
                ctx.fillStyle = fillStyle;
                ctx.fill();
            }
        }

        function draw (ctx) {
            var x0, y0;

            ctx.beginPath();

            if (x & y) {
                x0 = x(extent[0][0]);
                y0 = y(extent[1][0]);
            }
            else if (x) {
                x0 = xExtent[0];
                ctx.rect(x0 + rect[0], rect[1], xExtent[1]-x0, rect[3] || ctx.canvas.height);
            }
            else if (y)
                ctx.rect(0, extent[0][0], ctx.canvas.width, extent[0][1]-extent[0][0]);
        }

        function draw_sn_ (ctx, sn) {
        }

        function draw_we_ (ctx, ew) {
            var xv = xExtent[ew];
            ctx.beginPath();
            ctx.rect(xv - p + rect[0], rect[1], 2*p, rect[3] || ctx.canvas.height);
        }

        function Brushover () {
            var canvas = d3.select(this),
                ctx = this.getContext('2d'),
                origin = d3.canvas.mouse(this),
                xp = origin[0],
                yp = origin[1],
                resize = '';

            if (y) {
                draw_sn(ctx, 0);
                if (ctx.isPointInPath(xp, yp)) resize = 's';
                else {
                    draw_sn(ctx, 1);
                    if (ctx.isPointInPath(xp, yp)) resize = 'n';
                }
            }
            if (x) {
                draw_we(ctx, 0);
                if (ctx.isPointInPath(xp, yp)) resize += 'w';
                else {
                    draw_we_(ctx, 1);
                    if (ctx.isPointInPath(xp, yp)) resize += 'e';
                }
            }
            draw(ctx);
            if (resize) {
                canvas.style('cursor', d3_svg_brushCursor[resize])
                    .datum(resize).classed('extent', false);
            } else {
                if (ctx.isPointInPath(xp, yp))
                    canvas.style('cursor', 'move').classed('extent', true).datum('');
                else
                    canvas.style('cursor', 'crosshair').classed('extent', false).datum('');
            }
        }

        function Brushstart() {
            var target = this,
                ctx = target.getContext('2d'),
                origin = d3.canvas.mouse(target),
                //event_ = event.of(target, arguments),
                canvas = d3.select(target),
                resizing = canvas.datum(),
                resizingX = !/^(n|s)$/.test(resizing) && x,
                resizingY = !/^(e|w)$/.test(resizing) && y,
                dragging = canvas.classed("extent"),
                center,
                offset;

            var w = d3.select(window)
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
            d3.select("body").style("cursor", canvas.style("cursor"));

            // Notify listeners.
            event.brushstart({type: "brushstart"});

            brushmove();

            function keydown() {
                if (d3.event.keyCode == 32) {
                    if (!dragging) {
                        center = null;
                        origin[0] -= xExtent[1];
                        origin[1] -= yExtent[1];
                        dragging = 2;
                    }
                    d3.event.preventDefault();
                }
            }

            function keyup() {
                if (d3.event.keyCode == 32 && dragging == 2) {
                    origin[0] += xExtent[1];
                    origin[1] += yExtent[1];
                    dragging = 0;
                    d3.event.preventDefault();
                }
            }

            function brushmove() {
                var point = d3.canvas.mouse(target);

                d3.canvas.clear(ctx);

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

                var ev = {type: "brush"};

                // Final redraw and notify listeners.
                if ((resizingX && move1(point, x, 0)) ||
                    (resizingY && move1(point, y, 1)))
                    ev.mode = dragging ? "move" : "resize";

                event.brush.call(ctx, {type: "brush", mode: dragging ? "move" : "resize"});
                brushfill(ctx);
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
                d3.select("body").style("cursor", null);

                w.on("mousemove.brush", null)
                    .on("mouseup.brush", null)
                    .on("touchmove.brush", null)
                    .on("touchend.brush", null)
                    .on("keydown.brush", null)
                    .on("keyup.brush", null);

                event.brushend.call(ctx, {type: "brushend"});
            }
        }

        brush.draw_sn = function (_) {
            if (!arguments.length) return draw_sn;
            draw_sn = d3_functor(_);
            return brush;
        };

        brush.draw_we = function (_) {
            if (!arguments.length) return draw_we;
            draw_we = d3_functor(_);
            return brush;
        };

        brush.fillStyle = function (_) {
            if (!arguments.length) return fillStyle;
            fillStyle = _;
            return brush;
        };

        brush.rect = function (_) {
            if (!arguments.length) return rect;
            rect = _;
            return brush;
        };

        brush.x = function(z) {
            if (!arguments.length) return x;
            x = z;
            resizes = d3_svg_brushResizes[!x << 1 | !y]; // fore!
            return brush;
        };

        brush.y = function(z) {
            if (!arguments.length) return y;
            y = z;
            resizes = d3_svg_brushResizes[!x << 1 | !y]; // fore!
            return brush;
        };

        brush.clamp = function(z) {
            if (!arguments.length) return x && y ? [xClamp, yClamp] : x ? xClamp : y ? yClamp : null;
            if (x && y) xClamp = !!z[0], yClamp = !!z[1];
            else if (x) xClamp = !!z;
            else if (y) yClamp = !!z;
            return brush;
        };

        brush.extent = function(z) {
            var x0, x1, y0, y1, t;

            // Invert the pixel extent to data-space.
            if (!arguments.length) {
              if (x) {
                if (xExtentDomain) {
                  x0 = xExtentDomain[0], x1 = xExtentDomain[1];
                } else {
                  x0 = xExtent[0], x1 = xExtent[1];
                  if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);
                  if (x1 < x0) t = x0, x0 = x1, x1 = t;
                }
              }
              if (y) {
                if (yExtentDomain) {
                  y0 = yExtentDomain[0], y1 = yExtentDomain[1];
                } else {
                  y0 = yExtent[0], y1 = yExtent[1];
                  if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);
                  if (y1 < y0) t = y0, y0 = y1, y1 = t;
                }
              }
              return x && y ? [[x0, y0], [x1, y1]] : x ? [x0, x1] : y && [y0, y1];
            }

            // Scale the data-space extent to pixels.
            if (x) {
              x0 = z[0], x1 = z[1];
              if (y) x0 = x0[0], x1 = x1[0];
              xExtentDomain = [x0, x1];
              if (x.invert) x0 = x(x0), x1 = x(x1);
              if (x1 < x0) t = x0, x0 = x1, x1 = t;
              if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [x0, x1]; // copy-on-write
            }
            if (y) {
              y0 = z[0], y1 = z[1];
              if (x) y0 = y0[1], y1 = y1[1];
              yExtentDomain = [y0, y1];
              if (y.invert) y0 = y(y0), y1 = y(y1);
              if (y1 < y0) t = y0, y0 = y1, y1 = t;
              if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [y0, y1]; // copy-on-write
            }

            return brush;
          };

        brush.clear = function() {
            if (!brush.empty()) {
              xExtent = [0, 0], yExtent = [0, 0]; // copy-on-write
              xExtentDomain = yExtentDomain = null;
            }
            return brush;
        };

        brush.empty = function() {
            return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];
        };

        brush.draw_sn(draw_sn_).draw_we(draw_we_);

        return d3.rebind(brush, event, "on");

    };
