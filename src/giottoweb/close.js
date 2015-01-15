
    d3.giotto.angular.module(angular).addAll();

    lux.bootstrap('giottoExamples', ['lux.nav', 'giotto']);

    // Process giottoQueue
    if (this.giottoQueue) {
        var queue = this.giottoQueue;
        this.giottoQueue = [];
        queue.forEach(function (callback) {
            callback();
        });
    }
});