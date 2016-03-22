
gexamples.brush1 = {
    yaxis: {
        min: 0,
        max: 1
    },

    point: {
        show: true,
        color: '#fff',
        fill: '#6baed6',
        lineWidth: 1,
        active: {
            size: '100%',
            color: '#333'
        }
    },

    brush: {
        axis: 'x',
        extent: [0.4, 0.6],
        fillOpacity: 0.2
    },

    data: {
        src: function (chart) {
            var norm = d3.random.normal(0.5, 0.1);
            return [d3.range(800).map(function () {
                        return [Math.random(), norm()];
                    })];
        }
    },

    // Callback for angular directive
    angular: function (chart, opts) {

        chart.scope().$on('formFieldChange', function (e, form, field) {
            if (field === 'type') {
                opts.type = form[field];
                chart.resume();
            }
        });
    }
};
