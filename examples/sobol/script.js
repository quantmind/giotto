
    gexamples.sobol = {
        height: '80%',

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