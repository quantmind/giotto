gexamples.area2 = {
    height: '60%',
    min_height: 250,

    grid: true,
    tooltip: true,

    line: {
        area: true,
        lineWidth: 1,
        fillOpacity: 0.7,
        gradient: true,
        active: {
            fillOpacity: 1,
            fill: '#fff',
            lineWidth: 2,
            symbol: 'circle',
            size: '10px'
        }
    },

    data: {
        src: function () {
            return [randomPath(300)];
        }
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
