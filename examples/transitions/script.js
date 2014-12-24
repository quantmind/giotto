
    gexamples.transition1 = {
        height: '80%',

        tooltip: {
            show: true,
        },

        yaxis: {
            min: 0,
            max: 2,
            show: false
        },

        bar: {
            show: true,
            fill: '#D79404',
            lineWidth: 1,
            transition: {
                duration: 1000,
                ease: 'linear'
            }
        },

        data: function (chart) {
            return [randomData(10, 1, 0.3)];
        },

        onInit: function (chart, opts) {

            function animate () {
                chart.each(function (serie) {
                    serie.data(randomData(10, 1, 0.3));
                });
                chart.resume();
                d3.timer(animate, 2*opts.bar.transition.duration);
                return true;
            }

            animate();
        },

        // Callback for angular directive
        angular: function (chart, opts) {

            function update (form) {
                if (form.type) {
                    opts.type = form.type;
                    chart.resume();
                }
            }

            opts.scope.$on('formReady', function (e, form) {
                update(form);
            });
            opts.scope.$on('formFieldChange', function (e, form) {
                update(form);
            });
        }
    };

    function randomData (N, µ, σ) {
        // Create a random path
        var data = [],
            norm = d3.random.normal(µ, σ);
        d3.range(0, N, 1).forEach(function (x) {
            data.push([x, norm()]);
        });
        return data;
    }