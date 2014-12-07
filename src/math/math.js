    var ε = 1e-6,
        ε2 = ε * ε,
        π = Math.PI,
        τ = 2 * π,
        τε = τ - ε,
        halfπ = π / 2,
        d3_radians = π / 180,
        d3_degrees = 180 / π,
        abs = Math.abs;

    g.math.xyfunction = function (X, funy) {
        var xy = [];
        if (isArray(X))
            X.forEach(function (x) {
                xy.push([x, funy(x)]);
            });
        return xy;
    };

    // The arithmetic average of a array of points
    g.math.mean = function (points) {
        var mean = points[0].slice(0), // copy the first point
            point, i, j;
        for (i=1; i<points.length; ++i) {
            point = points[i];
            for (j=0; j<mean.length; ++j)
                mean[j] += point[j];
        }
        for (j=0; j<mean.length; ++j)
            mean[j] /= points.length;
        return mean;
    };