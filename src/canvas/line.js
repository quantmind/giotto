
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
                interpolate(ctx, projection(points), tension);
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
        "basis": d3_canvas_lineBasis
        //"basis-open": d3_svg_lineBasisOpen,
        //"basis-closed": d3_svg_lineBasisClosed,
        //"bundle": d3_svg_lineBundle,
        //"cardinal": d3_svg_lineCardinal,
        //"cardinal-open": d3_svg_lineCardinalOpen,
        //"cardinal-closed": d3_svg_lineCardinalClosed,
        //"monotone": d3_svg_lineMonotone
    });

    function d3_canvas_lineLinear(ctx, points) {
        var p = points[0];
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
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
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
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
        ctx.beginPath();
        ctx.moveTo(pn[0], pn[1]);
        for (var i=1; i<points.length; ++i) {
            p = pn;
            pn = points[i];
            ctx.lineTo(p[0], pn[1]);
            ctx.lineTo(pn[0], pn[1]);
        }
    }

    function d3_canvas_lineStepAfter(ctx, points) {
        var pn = points[0], p;
        ctx.beginPath();
        ctx.moveTo(pn[0], pn[1]);
        for (var i=1; i<points.length; ++i) {
            p = pn;
            pn = points[i];
            ctx.lineTo(pn[0], p[1]);
            ctx.lineTo(pn[0], pn[1]);
        }
    }

    function d3_canvas_lineBasis(ctx, points) {

    }
