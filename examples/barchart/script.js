
    gexamples.barchart = {
        height: '80%',

        tooltip: {
            show: true,
        },

        line: {show: true},

        bar: {
            show: true,
            formatY: ',.3g'
        },

        data: function (chart) {
            var X = d3.range(-5, 5, 0.5);

            return [d3.giotto.math.xyfunction(X, function (x) {
                        return 1/(1+Math.exp(-x)) - 0.5;
                    })];
        },

        // Callback for angular directive
        angular: function (chart, opts) {

            function update (form) {
                if (form.type) {
                    opts.type = form.type;
                    chart.resume();
                }
            }

            chart.scope().$on('formReady', function (e, form) {
                update(form);
            });
            chart.scope().$on('formFieldChange', function (e, form) {
                update(form);
            });
        }
    };