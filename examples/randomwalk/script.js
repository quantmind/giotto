
    examples.randomwalk = {

        //point: {show: true;}

        data: function (chart) {
            var t = d3.range(0, 3000, 1),
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
            d3.giotto.crossfilter({
                data: data,
                dimensions: ['time'],
                callback: function (cf) {
                    chart.setData(cf);
                }
            });
        }
    };
