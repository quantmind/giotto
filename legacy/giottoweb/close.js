
    d3.giotto.angular.module(angular).addAll();

    lux.bootstrap('giottoExamples', ['lux.nav', 'giotto', 'giottoweb']);

    // Process giottoQueue
    if (window.giottoQueue) {
        var queue = window.giottoQueue;
        window.giottoQueue = [];
        queue.forEach(function (callback) {
            callback();
        });
    }
});