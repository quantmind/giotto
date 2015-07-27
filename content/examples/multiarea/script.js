
    gexamples.area3 = {
        height: '60%',
        min_height: 250,

        grid: true,

        line: {
            show: true,
            area: true,
            lineWidth: 2,
            fillOpacity: 0.5,
            gradient: '#fff',
            transition: {
                duration: 500
            },
            active: {
                fillOpacity: 1,
                symbol: 'circle',
                size: '10px'
            }
        },

        legend: {
            position: 'top-left',
            margin: 50
        },

        tooltip: true,

        data: {
            src: function () {
                return [randomPath(300), randomPath(300), randomPath(300)];
            }
        },

        // Callback for angular directive
        angular: function (chart, opts) {

            chart.scope().$on('formFieldChange', function (e, form) {
                opts.type = form.type;
                chart.resume();
            });

            chart.scope().$on('randomiseClick', function (e) {
                e.preventDefault();
                chart.each(function (serie) {
                    serie.data(randomPath(300));
                });
                chart.resume();
            });
        }
    };


    function randomPath (N) {
        // Create a random path
        var t = d3.range(0, N, 1),
            σ = 1,
            µ = 0.1,
            data = [[0, 1]],
            norm = d3.random.normal(0, σ),
            dt;

        for(var i=1; i<t.length; i++) {
            dt = t[i] - t[i-1];
            dx = dt*µ + σ*norm()*Math.sqrt(dt);
            data[i] = [i, data[i-1][1] + dx];
        }
        return data;
    }
