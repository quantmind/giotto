
    gexamples.zooming1 = {

        height: '70%',

        grid: {
            show: true,
            backgroundColor: '#aec7e8'
        },

        zoom: {
            x: true,
            y: false
        },

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