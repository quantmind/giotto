

    examples.sigmoid = function () {

        var X = d3.range(-2, 2, 0.1);

        return {
            data: [
                d3.giotto.xyfunction(X, function (x) {
                    return 1/(1+Math.exp(-x));
                }),
                d3.giotto.xyfunction(X, function (x) {
                    return x*x;
                })
            ]
        };
    };
