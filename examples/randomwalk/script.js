    //Check this example http://dc-js.github.io/dc.js/docs/stock.html

    gexamples.randomwalk = {
        //type: 'canvas',
        height: '60%',
        min_height: 250,

        serie: {
            x: function (d) {return d.time;},
            y: function (d) {return d.value;}
        },

        //margin: {bottom: '70%'},
        brush: {
            axis: 'x'
        },

        grid: {
            show: true
        },

        line: {
            show: true,
            area: true
        },

        data: function () {
            return [randomPath(3000), randomPath(3000)];
        },

        onInitx: function (chart, opts) {
            var paper = chart.paper(),
                brush = paper.group({margin: {top: '75%'}});
            brush.element().classed('brush', true);

        },

        datax: function (chart) {

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
                    chart.resume();
                    //chart.paper().extent(extent);
                }
            });
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
