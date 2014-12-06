
    gexamples.sigmoid = {
        height: '80%',

        data: function (chart) {
            var X = d3.range(-5, 5, 0.1);

            return [chart.xyfunction(X, function (x) {
                        return 1/(1+Math.exp(-x));
                    }),
                    {
                        points: {show: true},
                        data: chart.xyfunction(X, function (x) {
                            var d = 1/(1+Math.exp(-x));
                            return d*(1 - d);
                        })
                    }];
        },

        // Callback for angular directive
        angular: function (chart, opts) {

            opts.scope.$on('formFieldChange', function (e, model) {
                var value = model.form[model.field];

                if (model.field === 'type') {
                    // rebuild paper
                    opts.type = value;
                    chart.paper(true);
                    chart.resume();
                }
            });
        }
    };