
    gexamples.brush1 = {
        height: '20%',
        margin: {left: 0, right: 0, top: 0, bottom: 0},
        css: {
            selected: {
                stroke: '#444',
                'stroke-width': '1.5px'
            }
        },

        yaxis: {
            show: false,
            min: 0,
            max: 1
        },

        brush: {
            axis: 'x',
            extent: [0.4, 0.6],
            fillOpacity: 0.5
        },

        data: function (chart) {
            var norm = d3.random.normal(0.5, 0.1);
            return [{
                point: {
                    lineWidth: 0,
                    active: {
                        lineWidth: 1
                    }
                },
                data: d3.range(800).map(function () {
                    return [Math.random(), norm()];
                })
            }];
        },

        // Callback for angular directive
        angular: function (chart, opts) {

            opts.scope.$on('formFieldChange', function (e, form, field) {
                if (field === 'type') {
                    opts.type = form[field];
                    chart.resume();
                }
            });
        }
    };
