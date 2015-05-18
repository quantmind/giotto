
    gexamples.sigmoid = {
        height: '80%',

        data: {
            src: function (chart) {
                var X = d3.range(-5, 5, 0.5);

                return [d3.giotto.math.xyfunction(X, function (x) {
                            return 1/(1+Math.exp(-x));
                        }),
                        {
                            point: {
                                size: '12px'
                            },
                            data: d3.giotto.math.xyfunction(X, function (x) {
                                var d = 1/(1+Math.exp(-x));
                                return d*(1 - d);
                            })
                        }
                        ];
            }
        },

        // Callback for angular directive
        onInit: function (chart) {

            chart.scope().$on('formFieldChange', function (e, form, field) {
                if (field === 'type') {
                    chart.options().type = form[field];
                    chart.resume();
                }
            });
        }
    };