define(["angular",
        "giotto",
        "markdown"], function (angular, d3) {
    //
    // Enable debug if needed
    d3.logger().debugEnabled(true);
    //
    // Expose functions used in examples
    angular.module('giottojs.data', [])

        .run(['$rootScope', (scope) => {
            scope.d3 = d3;
            d3.examples = {};
            var examples = d3.examples;

            examples.simpleBarChart = simpleBarChart;
        }])
        //
        // JSON representation of giotto default options
        .directive('giottoOptions', ['$window', function ($window) {

            return {
                restrict: 'AE',
                link: function (scope, element, attrs) {
                    var key = attrs.giottoOptions,
                        data = d3.defaults;
                    if (key) data = data[key];

                    var df = angular.toJson(data, 4).split('\n');
                    df = df.map(function (v) {
                        return '    ' + v;
                    }).join('\n');
                    element.html($window.markdown.toHTML(df));
                }
            };
        }])

        .controller('GiottoTools', ['$scope', function (scope) {
            var vm = this;

            vm.randomize = function () {
                var gt = scope.gt;
                if (gt) {
                    gt.broadcast('draw');
                    gt.data.load();
                }
            };
        }]);


    function simpleBarChart () {
        return d3.array.range(-5, 5, 0.5).map((x) => {
            return [x, 1/(1+Math.exp(-x)) - 0.5];
        });
    }

});
