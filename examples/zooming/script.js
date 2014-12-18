
    gexamples.zooming1 = {

        height: '70%',
        tooltip: {show: true},
        grid: {
            show: true,
            zoomx: true
        },

        point: {show: true},
        line: {show: true},

        data: function (chart) {
            var X = d3.range(-5, 5, 0.1);

            return [chart.xyfunction(X, function (x) {
                        return 1/(1+Math.exp(-x));
                    }),
                    chart.xyfunction(X, function (x) {
                        var d = 1/(1+Math.exp(-x));
                        return d*(1 - d);
                    })];
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