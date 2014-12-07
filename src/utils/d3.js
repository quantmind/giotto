
    function d3_identity(d) {
        return d;
    }

    function d3_functor (v) {
        return typeof v === "function" ? v : function() {
            return v;
        };
    }

    function d3_scaleExtent(domain) {
        var start = domain[0], stop = domain[domain.length - 1];
        return start < stop ? [ start, stop ] : [ stop, start ];
    }

    function d3_scaleRange(scale) {
        return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
    }

    function d3_geom_pointX(d) {
        return d[0];
    }

    function d3_geom_pointY(d) {
        return d[1];
    }

    function d3_true() {
        return true;
    }

    // Matrix to transform basis (b-spline) control points to bezier
    // control points. Derived from FvD 11.2.8.
    var d3_svg_lineBasisBezier1 = [0, 2/3, 1/3, 0],
        d3_svg_lineBasisBezier2 = [0, 1/3, 2/3, 0],
        d3_svg_lineBasisBezier3 = [0, 1/6, 2/3, 1/6];

    // Computes the slope from points p0 to p1.
    function d3_svg_lineSlope(p0, p1) {
        return (p1[1] - p0[1]) / (p1[0] - p0[0]);
    }

    // Returns the dot product of the given four-element vectors.
    function d3_svg_lineDot4(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }

    // Generates tangents for a cardinal spline.
    function d3_svg_lineCardinalTangents(points, tension) {
        var tangents = [],
            a = (1 - tension) / 2,
            p0,
            p1 = points[0],
            p2 = points[1],
            i = 1,
            n = points.length;
        while (++i < n) {
            p0 = p1;
            p1 = p2;
            p2 = points[i];
            tangents.push([a * (p2[0] - p0[0]), a * (p2[1] - p0[1])]);
        }
        return tangents;
    }

    // Compute three-point differences for the given points.
    // http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Finite_difference
    function d3_svg_lineFiniteDifferences(points) {
        var i = 0,
          j = points.length - 1,
          m = [],
          p0 = points[0],
          p1 = points[1],
          d = m[0] = d3_svg_lineSlope(p0, p1);
        while (++i < j) {
            m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
        }
        m[i] = d;
        return m;
    }

    // Interpolates the given points using Fritsch-Carlson Monotone cubic Hermite
    // interpolation. Returns an array of tangent vectors. For details, see
    // http://en.wikipedia.org/wiki/Monotone_cubic_interpolation
    function d3_svg_lineMonotoneTangents(points) {
        var tangents = [],
          d,
          a,
          b,
          s,
          m = d3_svg_lineFiniteDifferences(points),
          i = -1,
          j = points.length - 1;

        // The first two steps are done by computing finite-differences:
        // 1. Compute the slopes of the secant lines between successive points.
        // 2. Initialize the tangents at every point as the average of the secants.

        // Then, for each segment…
        while (++i < j) {
            d = d3_svg_lineSlope(points[i], points[i + 1]);

            // 3. If two successive yk = y{k + 1} are equal (i.e., d is zero), then set
            // mk = m{k + 1} = 0 as the spline connecting these points must be flat to
            // preserve monotonicity. Ignore step 4 and 5 for those k.

            if (abs(d) < ε) {
                m[i] = m[i + 1] = 0;
            } else {
                // 4. Let ak = mk / dk and bk = m{k + 1} / dk.
                a = m[i] / d;
                b = m[i + 1] / d;

                // 5. Prevent overshoot and ensure monotonicity by restricting the
                // magnitude of vector <ak, bk> to a circle of radius 3.
                s = a * a + b * b;
                if (s > 9) {
                    s = d * 3 / Math.sqrt(s);
                    m[i] = s * a;
                    m[i + 1] = s * b;
                }
            }
        }

        // Compute the normalized tangent vector from the slopes. Note that if x is
        // not monotonic, it's possible that the slope will be infinite, so we protect
        // against NaN by setting the coordinate to zero.
        i = -1; while (++i <= j) {
            s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
            tangents.push([s || 0, m[i] * s || 0]);
        }

        return tangents;
    }
