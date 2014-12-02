
    gexamples.barchart = {
        height: '80%',

        line: {show: true},

        bar: {show: true},

        data: function (chart) {
            var X = d3.range(-5, 5, 0.5);

            return [chart.xyfunction(X, function (x) {
                        return 1/(1+Math.exp(-x)) - 0.5;
                    })];
        }
    };