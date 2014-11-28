
    examples.sigmoid = {
        height: '80%',

        data: function (chart) {
            var X = d3.range(-2, 2, 0.1);

            return [chart.xyfunction(X, function (x) {
                        return 1/(1+Math.exp(-x));
                    }),
                    chart.xyfunction(X, function (x) {
                        return x*x;
                    })];
        }
    };