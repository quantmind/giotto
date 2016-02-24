define(["angular",
        "giotto"], function (angular, d3) {

    //
    // Expose functions used in examples
    angular.module('giottojs.data', [])
        .run(['$rootScope', (scope) => {
            scope.d3 = d3;
            d3.examples = {};
            var examples = d3.examples;

            examples.simpleBarChart = simpleBarChart;
        }]);


    function simpleBarChart () {
        return d3.array.range(-5, 5, 0.5).map((x) => {
            return [x, 1/(1+Math.exp(-x)) - 0.5];
        });
    }

});
