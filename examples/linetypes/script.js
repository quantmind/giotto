
    gexamples.linetypes = {
        height: '70%',

        point: {
            show: true,
            lineWidth: 3,
            size: '12px'
        },

        line: {
            show: true,
            interpolate: 'linear',
            lineWidth: 3
        },

        grid: {
            show: true,
            color: '#000'
        },

        data: function () {
            return [randomPath(0.2, 0.3)];
        },

        // Callback for angular directive
        angular: function (chart, opts) {

            opts.scope.$on('formFieldChange', function (e, model) {
                var value = model.form[model.field];

                if (model.field === 'type') {
                    opts.type = value;
                    chart.paper(true);
                } else if (model.field === 'interpolate') {
                    opts.line.interpolate = value;
                } else if (model.field === 'symbol') {
                    opts.point.symbol = value;
                }
                chart.resume();
            });
        }
    };

    function randomPath (µ, σ) {
        // Create a random path
        var t = d3.range(0, 5, 0.5),
            data = [{x: t[0], y: 1}],
            norm = d3.random.normal(0, 1),
            dt, dy;

        for(var i=1; i<t.length; i++) {
            dt = t[i] - t[i-1];
            dy = dt*µ + σ*norm()*Math.sqrt(dt);
            data[i] = {x: t[i], y: data[i-1].y + dy};
        }
        return data;
    }