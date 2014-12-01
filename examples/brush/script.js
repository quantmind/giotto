
    examples.brushes = {
        height: '20%',

        yaxis: {
            show: false,
            min: 0,
            max: 1
        },

        brush: {
            extend: [0.4, 0.6]
        },

        data: function (chart) {
            var norm = d3.random.normal(0.5, 0.1);
            return [{
                line: {show: false},
                point: {show: true},
                data: d3.range(800).map(function () {
                    return [Math.random(), norm()];
                })
            }];
        }
    };
