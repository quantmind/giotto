    gexamples.area1 = {
        height: '60%',

        min_height: 250,

        // Override default x,y accessor for series
        serie: {
            x: function (d) {return d.time;},
            y: function (d) {return d.value;}
        },

        grid: {
            show: true
        },

        line: {
            area: true,
            lineWidth: 1,
            color: '#2ca25f',
            fillOpacity: 0.3,
            active: {
                fillOpacity: 1,
                symbol: 'circle',
                size: '10px'
            }
        },

        tooltip: true,

        data: function () {
            return [randomPath(300)];
        },

        // Callback for angular directive
        onInit: function (chart) {

            chart.scope().$on('formFieldChange', function (e, form) {
                chart.options().type = form.type;
                chart.resume();
            });
        }
    };


    function randomPath (N) {
        // Create a random path
        var t = d3.range(0, N, 1),
            σ = 0.1,
            µ = 0,
            data = [{time: 0, value: 0}],
            norm = d3.random.normal(0, σ),
            dt;

        for(var i=1; i<t.length; i++) {
            dt = t[i] - t[i-1];
            dx = dt*µ + σ*norm()*Math.sqrt(dt);
            data[i] = {
                time: i,
                value: data[i-1].value + dx
            };
        }
        return data;
    }
