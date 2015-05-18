
    gexamples.barchart = {
        height: '80%',

        tooltip: true,

        line: {show: true},

        bar: {
            show: true,
            formatY: ',.3g'
        },

        data: {
            src: function () {
                var X = d3.range(-5, 5, 0.5);

                return [d3.giotto.math.xyfunction(X, function (x) {
                            return 1/(1+Math.exp(-x)) - 0.5;
                        })];
            }
        }
    };