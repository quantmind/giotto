
    g.xyfunction = function (X, funy) {
        var xy = [];
        if (isArray(X))
            X.forEach(function (x) {
                xy.push([x, funy(x)]);
            });
        return xy;
    };
