
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