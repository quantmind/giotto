    //Check this example http://dc-js.github.io/dc.js/docs/stock.html

    gexamples.randomwalkMain = {
        height: '55%',
        points: {show: true},

    };

    gexamples.randomwalkBrush = {
        height: '15%',

        brush: {
            axis: 'x'
        },

        data: function (chart) {

            // Setup a crossfilter with some random data
            d3.giotto.crossfilter({

                data: randomPath(3000),

                dimensions: ['time'],

                // Callback when crossfilter is ready
                callback: function (cf) {
                    var f = cf.dims.time.filter(),
                        end = f.top(1)[0].time,
                        start = f.bottom(1)[0].time,
                        extent = [end-0.3*(end-start), end];
                    var data = cf.reduceDensity('time', 300);
                    chart.addSerie({
                        data: data,
                        xlabel: 'time',
                        ylabel: 'value'
                    });
                    chart.paper().extent(extent);
                }
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
