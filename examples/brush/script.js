
    examples.brush1 = {
        height: '20%',

        css: {
            selected: {
                stroke: '#f00',
                'stroke-width': '1.5px'
            }
        },

        yaxis: {
            show: false,
            min: 0,
            max: 1
        },

        brush: {
            extent: [0.4, 0.6]
        },

        data: function (chart) {
            var norm = d3.random.normal(0.5, 0.1);
            return [{
                line: {show: false},
                point: {
                    show: true,
                    width: 0
                },
                data: d3.range(800).map(function () {
                    return [Math.random(), norm()];
                })
            }];
        }
    };
