
    // same as d3.svg.area... but for canvas
    d3.canvas.area = function() {
        return d3_canvas_area(d3_identity);
    };

    function d3_canvas_area(projection) {
        var x0 = d3_geom_pointX,
            x1 = d3_geom_pointX,
            y0 = 0,
            y1 = d3_geom_pointY,
            defined = d3_true,
            interpolate = d3_canvas_lineLinear,
            interpolateKey = interpolate.key,
            interpolateReverse = interpolate,
            tension = 0.7,
            ctx;

      function area(data) {
            if (!ctx) return;

            var segments = [],
                points0 = [],
                points1 = [],
                i = -1,
                n = data.length,
                d,
                fx0 = d3_functor(x0),
                fy0 = d3_functor(y0),
                fx1 = x0 === x1 ? function() { return x; } : d3_functor(x1),
                fy1 = y0 === y1 ? function() { return y; } : d3_functor(y1),
                x,
                y;

            function segment () {
                var p1 = projection(points1),
                    p0 = projection(points0.reverse());

                d3_canvas_move(ctx, p1[0], true);
                interpolate(ctx, p1, tension);
                d3_canvas_move(ctx, p0[0], interpolate.closed);
                interpolateReverse(ctx, p0, tension);
                ctx.closePath();
            }

            while (++i < n) {
                if (defined.call(area, d = data[i], i)) {
                    points0.push([x = +fx0.call(area, d, i), y = +fy0.call(area, d, i)]);
                    points1.push([+fx1.call(area, d, i), +fy1.call(area, d, i)]);
                } else if (points0.length) {
                    segment();
                    points0 = [];
                    points1 = [];
                }
            }

            if (points0.length) segment();

            return segments.length ? segments.join("") : null;
        }

        area.context = function (_) {
            if (!arguments.length) return ctx;
            ctx = _;
            return area;
        };

        area.x = function(_) {
            if (!arguments.length) return x1;
            x0 = x1 = _;
            return area;
        };

        area.x0 = function(_) {
            if (!arguments.length) return x0;
            x0 = _;
            return area;
        };

        area.x1 = function(_) {
            if (!arguments.length) return x1;
            x1 = _;
            return area;
        };

        area.y = function(_) {
            if (!arguments.length) return y1;
            y0 = y1 = _;
            return area;
        };

        area.y0 = function(_) {
            if (!arguments.length) return y0;
            y0 = _;
            return area;
        };

        area.y1 = function(_) {
            if (!arguments.length) return y1;
            y1 = _;
            return area;
        };

        area.defined  = function(_) {
            if (!arguments.length) return defined;
            defined = _;
            return area;
        };

        area.interpolate = function(_) {
            if (!arguments.length) return interpolateKey;
            if (typeof _ === "function") interpolateKey = interpolate = _;
            else interpolateKey = (interpolate = d3_canvas_lineInterpolators.get(_) || d3_canvas_lineLinear).key;
            interpolateReverse = interpolate.reverse || interpolate;
            return area;
        };

        area.tension = function(_) {
            if (!arguments.length) return tension;
            tension = _;
            return area;
        };

        return area;
    }
