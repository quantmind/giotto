
    gsexamples.sigmoid = {
        height: '80%',

        data: function (chart) {
            var X = d3.range(-5, 5, 0.1);

            return [chart.xyfunction(X, function (x) {
                        return 1/(1+Math.exp(-x));
                    }),
                    chart.xyfunction(X, function (x) {
                        var d = 1/(1+Math.exp(-x));
                        return d*(1 - d);
                    })];
        }
    };