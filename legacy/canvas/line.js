
    // same as d3.svg.line... but for canvas
    d3.canvas.line = function() {
        return d3_canvas_line(d3_identity);
    };


    function d3_canvas_line (projection) {
        var x = d3_geom_pointX,
            y = d3_geom_pointY,
            defined = d3_true,
            interpolate = d3_canvas_lineLinear,
            interpolateKey = interpolate.key,
            tension = 0.7,
            ctx;

        function line (data) {
            if (!ctx) return;

            var segments = [],
                points = [],
                i = -1,
                n = data.length,
                d,
                fx = d3_functor(x),
                fy = d3_functor(y);

            function segment () {
                var p = projection(points);
                d3_canvas_move(ctx, p[0], true);
                interpolate(ctx, p, tension);
            }

            while (++i < n) {
                if (defined.call(line, d = data[i], i)) {
                    points.push([+fx.call(line, d, i), +fy.call(line, d, i)]);
                } else if (points.length) {
                    segment();
                    points = [];
                }
            }

            if (points.length) segment();

            return segments.length ? segments.join("") : null;
        }

        line.context = function (_) {
            if (!arguments.length) return ctx;
            ctx = _;
            return line;
        };

        line.x = function(_) {
            if (!arguments.length) return x;
            x = _;
            return line;
        };

        line.y = function(_) {
            if (!arguments.length) return y;
            y = _;
            return line;
        };

        line.defined  = function(_) {
            if (!arguments.length) return defined;
            defined = _;
            return line;
        };

        line.interpolate = function(_) {
            if (!arguments.length) return interpolateKey;
            if (typeof _ === "function") interpolateKey = interpolate = _;
            else interpolateKey = (interpolate = d3_canvas_lineInterpolators.get(_) || d3_canvas_lineLinear).key;
            return line;
        };

        line.tension = function(_) {
            if (!arguments.length) return tension;
            tension = _;
            return line;
        };

        return line;
    }


    var d3_canvas_lineInterpolators = d3.map({
        "linear": d3_canvas_lineLinear,
        "linear-closed": d3_canvas_lineLinearClosed,
        "step": d3_canvas_lineStep,
        "step-before": d3_canvas_lineStepBefore,
        "step-after": d3_canvas_lineStepAfter,
        "basis": d3_canvas_lineBasis,
        "basis-open": d3_canvas_lineBasisOpen,
        "basis-closed": d3_canvas_lineBasisClosed,
        "bundle": d3_canvas_lineBundle,
        "cardinal": d3_canvas_lineCardinal,
        "cardinal-open": d3_canvas_lineCardinalOpen,
        "cardinal-closed": d3_canvas_lineCardinalClosed,
        "monotone": d3_canvas_lineMonotone
    });

    function d3_canvas_move(ctx, point, move) {
        if (move) {
            ctx.beginPath();
            ctx.moveTo(point[0], point[1]);
        } else {
            ctx.lineTo(point[0], point[1]);
        }
    }

    function d3_canvas_lineLinear(ctx, points) {
        var p = points[0];
        for (var i=1; i<points.length; ++i) {
            p = points[i];
            ctx.lineTo(p[0], p[1]);
        }
    }

    function d3_canvas_lineLinearClosed(ctx, points) {
        d3_canvas_lineLinear(ctx, points);
        ctx.closePath();
    }

    function d3_canvas_lineStep(ctx, points) {
        var pn = points[1], p = points[0],
            x = 0.5*(pn[0] + p[0]);
        ctx.lineTo(x, p[1]);
        ctx.lineTo(x, pn[1]);
        for (var i=2; i<points.length; ++i) {
            p = pn;
            pn = points[i];
            x = 0.5*(pn[0] + p[0]);
            ctx.lineTo(x, p[1]);
            ctx.lineTo(x, pn[1]);
        }
        ctx.lineTo(pn[0], pn[1]);
    }

    function d3_canvas_lineStepBefore(ctx, points) {
        var pn = points[0], p;
        for (var i=1; i<points.length; ++i) {
            p = pn;
            pn = points[i];
            ctx.lineTo(p[0], pn[1]);
            ctx.lineTo(pn[0], pn[1]);
        }
    }

    function d3_canvas_lineStepAfter(ctx, points) {
        var pn = points[0], p;
        for (var i=1; i<points.length; ++i) {
            p = pn;
            pn = points[i];
            ctx.lineTo(pn[0], p[1]);
            ctx.lineTo(pn[0], pn[1]);
        }
    }

    function d3_canvas_lineBasis(ctx, points) {
        if (points.length < 3) return d3_canvas_lineLinear(ctx, points);
        var i = 1,
            n = points.length,
            pi = points[0],
            x0 = pi[0],
            y0 = pi[1],
            px = [x0, x0, x0, (pi = points[1])[0]],
            py = [y0, y0, y0, pi[1]];

        ctx.lineTo(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px),
                   d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));

        points.push(points[n - 1]);
        while (++i <= n) {
            pi = points[i];
            px.shift();
            px.push(pi[0]);
            py.shift();
            py.push(pi[1]);
            d3_canvas_lineBasisBezier(ctx, px, py);
        }
        points.pop();
        ctx.lineTo(pi[0], pi[1]);
    }

    // Open B-spline interpolation; generates "C" commands.
    function d3_canvas_lineBasisOpen(ctx, points) {
        if (points.length < 4) return d3_canvas_lineLinear(points);
        var path = [],
            i = -1,
            n = points.length,
            pi,
            px = [0],
            py = [0];
        while (++i < 3) {
            pi = points[i];
            px.push(pi[0]);
            py.push(pi[1]);
        }
        ctx.moveTo(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px),
                   d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
        --i; while (++i < n) {
            pi = points[i];
            px.shift(); px.push(pi[0]);
            py.shift(); py.push(pi[1]);
            d3_canvas_lineBasisBezier(ctx, px, py);
        }
    }

    // Closed B-spline interpolation; generates "C" commands.
    function d3_canvas_lineBasisClosed(ctx, points) {
        var path,
            i = -1,
            n = points.length,
            m = n + 4,
            pi,
            px = [],
            py = [];
        while (++i < 4) {
            pi = points[i % n];
            px.push(pi[0]);
            py.push(pi[1]);
        }
        ctx.moveTo(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px),
                   d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
        --i; while (++i < m) {
            pi = points[i % n];
            px.shift(); px.push(pi[0]);
            py.shift(); py.push(pi[1]);
            d3_canvas_lineBasisBezier(ctx, px, py);
        }
    }

    function d3_canvas_lineBundle(ctx, points, tension) {
        var n = points.length - 1;
        if (n) {
            var x0 = points[0][0],
                y0 = points[0][1],
                dx = points[n][0] - x0,
                dy = points[n][1] - y0,
                i = -1,
                p,
                t;
            while (++i <= n) {
                p = points[i];
                t = i / n;
                p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
                p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
            }
        }
        return d3_canvas_lineBasis(ctx, points);
    }

    function d3_canvas_lineCardinal(ctx, points, tension) {
        if (points.length < 3)
            d3_canvas_lineLinear(ctx, points);
        else {
            d3_canvas_lineHermite(ctx, points, d3_svg_lineCardinalTangents(points, tension));
        }
    }

    // Open cardinal spline interpolation; generates "C" commands.
    function d3_canvas_lineCardinalOpen(ctx, points, tension) {
        if (points.length < 4)
            d3_canvas_lineLinear(ctx, points);
        else {
            d3_canvas_lineHermite(ctx, points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension));
        }
    }

    // Closed cardinal spline interpolation; generates "C" commands.
    function d3_canvas_lineCardinalClosed(ctx, points, tension) {
        if (points.length < 3)
            d3_canvas_lineLinear(ctx, points);
        else {
            d3_canvas_lineHermite(ctx, (points.push(points[0]), points),
                d3_svg_lineCardinalTangents([points[points.length - 2]].concat(points, [points[1]]), tension));
        }
    }

    function d3_canvas_lineMonotone(ctx, points) {
        if (points.length < 3)
            d3_canvas_lineLinear(ctx, points);
        else {
            d3_canvas_lineHermite(ctx, points, d3_svg_lineMonotoneTangents(points));
        }
    }


    function d3_canvas_lineBasisBezier(ctx, x, y) {
        ctx.bezierCurveTo(d3_svg_lineDot4(d3_svg_lineBasisBezier1, x),
                          d3_svg_lineDot4(d3_svg_lineBasisBezier1, y),
                          d3_svg_lineDot4(d3_svg_lineBasisBezier2, x),
                          d3_svg_lineDot4(d3_svg_lineBasisBezier2, y),
                          d3_svg_lineDot4(d3_svg_lineBasisBezier3, x),
                          d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
    }


    function d3_canvas_lineHermite(ctx, points, tangents) {
        if (tangents.length < 1 ||
            (points.length != tangents.length && points.length != tangents.length + 2))
            return d3_canvas_lineLinear(ctx, points);

        var quad = points.length != tangents.length,
            p0 = points[0],
            p = points[1],
            t0 = tangents[0],
            t = t0,
            pi = 1,
            xc, yc;

        if (quad) {
            ctx.quadraticCurveTo((p[0] - t0[0] * 2 / 3), (p[1] - t0[1] * 2 / 3), p[0], p[1]);
            p0 = points[1];
            pi = 2;
        }

        if (tangents.length > 1) {
            t = tangents[1];
            p = points[pi];
            pi++;
            ctx.bezierCurveTo(p0[0] + t0[0], p0[1] + t0[1],
                              p[0] - t[0], p[1] - t[1],
                              p[0], p[1]);
            for (var i = 2; i < tangents.length; i++, pi++) {
                xc = p[0] + t[0];
                yc = p[1] + t[1];
                p = points[pi];
                t = tangents[i];
                ctx.bezierCurveTo(xc, yc,
                                  p[0] - t[0], p[1] - t[1],
                                  p[0], p[1]);
            }
        }

        if (quad) {
            var lp = points[pi];
            ctx.quadraticCurveTo((p[0] + t[0] * 2 / 3), (p[1] + t[1] * 2 / 3), lp[0], lp[1]);
        }
    }

    d3_canvas_lineStepBefore.reverse = d3_canvas_lineStepAfter;
    d3_canvas_lineStepAfter.reverse = d3_canvas_lineStepBefore;
