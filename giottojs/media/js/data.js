define(["angular",
        "giotto"], function (angular, giotto) {

    //
    // Expose functions used in examples
    angular.module('giottojs.data', [])
        .run(['$rootscope', (scope) => {
            scope.examples = {};
            var examples = scope.examples;

            examples.simpleBarChart = simpleBarChart;
            examples.randomPath = giotto.timeSeries.randomPath;
        }]);


    function simpleBarChart () {
        return giotto.array.range(-5, 5, 0.5).map((x) => {
            return [x, 1/(1+Math.exp(-x)) - 0.5];
        });
    }

});
