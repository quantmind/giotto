
    gexamples.area2 = {
        height: '60%',
        min_height: 250,

        grid: {
            show: true,
            fill: '#fff',
            fillOpacity: 1
        },

        line: {
            show: true,
            area: true,
            lineWidth: 1,
            fillOpacity: 0.8,
            gradient: '#fff'
        },

        data: function () {
            return [randomPath(300)];
        },

        // Callback for angular directive
        angular: function (chart, opts) {

            opts.scope.$on('formFieldChange', function (e, form) {
                opts.type = form.type;
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
