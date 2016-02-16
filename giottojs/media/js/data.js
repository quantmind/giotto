define(['lux/config/main'], function () {

    function randomPath(N) {
        // Create a random path
        var t = d3.range(0, N, 1),
            σ = 0.1,
            µ = 0,
            data = [{time: 0, value: 0}],
            norm = d3.random.normal(0, σ),
            dt;

        for (var i = 1; i < t.length; i++) {
            dt = t[i] - t[i - 1];
            dx = dt * µ + σ * norm() * Math.sqrt(dt);
            data[i] = {
                time: i,
                value: data[i - 1].value + dx
            };
        }
        return d3.giotto.serie().data(data).x('time').y('value');
    }

});
