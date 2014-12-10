
    // same as d3.svg.arc... but for canvas
    d3.canvas.arc = function() {
        var innerRadius = d3_svg_arcInnerRadius,
        outerRadius = d3_svg_arcOuterRadius,
        cornerRadius = d3_zero,
        padRadius = d3_svg_arcAuto,
        startAngle = d3_svg_arcStartAngle,
        endAngle = d3_svg_arcEndAngle,
        padAngle = d3_svg_arcPadAngle,
        ctx;

        function arc () {
            var r0 = Math.max(0, +innerRadius.apply(arc, arguments)),
                r1 = Math.max(0, +outerRadius.apply(arc, arguments)),
                a0 = startAngle.apply(arc, arguments) - halfπ,
                a1 = endAngle.apply(arc, arguments) - halfπ,
                da = Math.abs(a1 - a0),
                cw = a0 > a1 ? 0 : 1;

            // Ensure that the outer radius is always larger than the inner radius.
            if (r1 < r0) rc = r1, r1 = r0, r0 = rc;

            ctx.beginPath();

            // Special case for an arc that spans the full circle.
            if (da >= τε) {
                ctx.arc(0, 0, r1, 0, τ, false);
                if (r0)
                    ctx.arc(0, 0, r0, 0, τ, true);
                ctx.closePath();
                return;
            }

            var rc,
                cr,
                rp,
                laf,
                l0,
                l1,
                ap = (+padAngle.apply(arc, arguments) || 0) / 2,
                p0 = 0,
                p1 = 0,
                x0 = null,
                y0 = null,
                x1 = null,
                y1 = null,
                x2 = null,
                y2 = null,
                x3 = null,
                y3 = null,
                path = [];

            // The recommended minimum inner radius when using padding is outerRadius *
            // padAngle / sin(θ), where θ is the angle of the smallest arc (without
            // padding). For example, if the outerRadius is 200 pixels and the padAngle
            // is 0.02 radians, a reasonable θ is 0.04 radians, and a reasonable
            // innerRadius is 100 pixels.

            if (ap) {
                rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(arc, arguments);
                if (!cw) p1 *= -1;
                if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap));
                if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap));
            }

            // Compute the two outer corners.
            if (r1) {
                x0 = r1 * Math.cos(a0 + p1);
                y0 = r1 * Math.sin(a0 + p1);
                x1 = r1 * Math.cos(a1 - p1);
                y1 = r1 * Math.sin(a1 - p1);

                // Detect whether the outer corners are collapsed.
                l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
                if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
                    var h1 = (a0 + a1) / 2;
                    x0 = r1 * Math.cos(h1);
                    y0 = r1 * Math.sin(h1);
                    x1 = y1 = null;
                }
            } else {
                x0 = y0 = 0;
            }

            // Compute the two inner corners.
            if (r0) {
                x2 = r0 * Math.cos(a1 - p0);
                y2 = r0 * Math.sin(a1 - p0);
                x3 = r0 * Math.cos(a0 + p0);
                y3 = r0 * Math.sin(a0 + p0);

                // Detect whether the inner corners are collapsed.
                l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
                if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === (1 - cw) ^ l0) {
                    var h0 = (a0 + a1) / 2;
                    x2 = r0 * Math.cos(h0);
                    y2 = r0 * Math.sin(h0);
                    x3 = y3 = null;
                }
            } else
                x2 = y2 = 0;

            // Compute the rounded corners.
            if ((rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(arc, arguments))) > 1e-3) {
                cr = r0 < r1 ^ cw ? 0 : 1;

                // Compute the angle of the sector formed by the two sides of the arc.
                var oc = x3 === null ? [x2, y2] : x1 === null ? [x0, y0] : d3_geom_polygonIntersect([x0, y0], [x3, y3], [x1, y1], [x2, y2]),
                    ax = x0 - oc[0],
                    ay = y0 - oc[1],
                    bx = x1 - oc[0],
                    by = y1 - oc[1],
                    kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2),
                    lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);

                // Compute the outer corners.
                if (x1 !== null) {
                    var rc1 = Math.min(rc, (r1 - lc) / (kc + 1)),
                        t30 = d3_svg_arcCornerTangents(x3 === null ? [x2, y2] : [x3, y3], [x0, y0], r1, rc1, cw),
                        t12 = d3_svg_arcCornerTangents([x1, y1], [x2, y2], r1, rc1, cw);

                    // Detect whether the outer edge is fully circular.
                    if (rc === rc1) {
                        laf = (1 - cw) ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]);
                        drawArc(ctx, t30[0], t30[1], rc1, 0, cr);
                        drawArc(ctx, t30[1], t12[1], r1, laf, cw);
                        drawArc(ctx, t12[1], t12[0], rc1, 0, cr);
                        //ctx.moveTo(t12[0][0], t12[0][1]);
                    } else {
                        drawArc(ctx, t30[0], t12[0], rc1, 1, cr);
                        //ctx.moveTo(t12[0][0], t12[0][1]);
                    }
                } else
                    ctx.moveTo(x0, y0);

                // Compute the inner corners.
                if (x3 !== null) {
                    var rc0 = Math.min(rc, (r0 - lc) / (kc - 1)),
                        t03 = d3_svg_arcCornerTangents([x0, y0], [x3, y3], r0, -rc0, cw),
                        t21 = d3_svg_arcCornerTangents([x2, y2], x1 === null ? [x0, y0] : [x1, y1], r0, -rc0, cw);

                    // Detect whether the inner edge is fully circular.
                    ctx.lineTo(t21[0][0], t21[0][1]);
                    if (rc === rc0) {
                        laf = cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]);
                        ctx.lineTo(t21[0][0], t21[0][1]);
                        drawArc(ctx, t21[0], t21[1], rc0, 0, cr);
                        drawArc(ctx, t21[1], t03[1], r0, laf, 1 - cw);
                        drawArc(ctx, t03[1], t03[0], rc0, 0, cr);
                    } else
                        drawArc(ctx, t21[0], t03[0], rc0, 0, cr);
                    //ctx.moveTo(t03[0][0], t03[0][1]);
                } else
                    ctx.lineTo(x2, y2);
            }

            // Compute straight corners.
            else {
                if (x1 !== null) {
                    drawArc(ctx, [x0, y0], [x1, y1], r1, l1, cw);
                }
                ctx.lineTo(x2, y2);
                if (x3 !== null) {
                    drawArc(ctx, [x2, y2], [x3, y3], r0, l0, 1 - cw);
                }
            }

            ctx.closePath();
        }

        arc.context = function (_) {
            if (!arguments.length) return ctx;
            ctx = _;
            return arc;
        };

        arc.innerRadius = function (v) {
            if (!arguments.length) return innerRadius;
            innerRadius = d3_functor(v);
            return arc;
        };

        arc.outerRadius = function (v) {
            if (!arguments.length) return outerRadius;
            outerRadius = d3_functor(v);
            return arc;
        };

        arc.cornerRadius = function (v) {
            if (!arguments.length) return cornerRadius;
            cornerRadius = d3_functor(v);
            return arc;
        };

        arc.padRadius = function (v) {
            if (!arguments.length) return padRadius;
            padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v);
            return arc;
        };

        arc.startAngle = function(v) {
            if (!arguments.length) return startAngle;
            startAngle = d3_functor(v);
            return arc;
        };

        arc.endAngle = function(v) {
            if (!arguments.length) return endAngle;
            endAngle = d3_functor(v);
            return arc;
        };

        arc.padAngle = function(v) {
            if (!arguments.length) return padAngle;
            padAngle = d3_functor(v);
            return arc;
        };

        arc.centroid = function() {
            var r = (+innerRadius.apply(arc, arguments) + outerRadius.apply(arc, arguments)) / 2,
                a = (+startAngle.apply(arc, arguments) + endAngle.apply(arc, arguments)) / 2 - halfπ;
            return [Math.cos(a) * r, Math.sin(a) * r];
        };

        return arc;
    };

    var drawArc = d3.canvas.drawArc = function (ctx, xyfrom, xyto, radius, laf, sweep) {
        var dx = xyfrom[0] - xyto[0],
            dy = xyfrom[1] - xyto[1],
            q2 = dx*dx + dy*dy,
            q = Math.sqrt(q2),
            xc = 0.5*(xyfrom[0] + xyto[0]),
            yc = 0.5*(xyfrom[1] + xyto[1]),
            l =  Math.sqrt(radius*radius - 0.25*q2);
        if (sweep > 0) {
            xc += l*dy/q;
            yc -= l*dx/q;
        } else {
            xc -= l*dy/q;
            yc += l*dx/q;
        }
        var a1 = Math.atan2(xyfrom[1]-yc, xyfrom[0]-xc),
            a2 = Math.atan2(xyto[1]-yc, xyto[0]-xc);
        ctx.arc(xc, yc, radius, a1, a2, sweep<=0);
    };