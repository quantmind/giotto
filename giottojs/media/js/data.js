define(["angular",
        "giotto",
        "markdown"], function (angular, gt) {
    //
    // Expose functions used in examples
    angular.module('giottojs.data', [])
        .run(['$rootScope', (scope) => {
            scope.gt = gt;
            gt.examples = {};
            var examples = gt.examples;

            examples.simpleBarChart = simpleBarChart;
        }])
        //
        // JSON representation of giotto default options
        .directive('giottoOptions', ['$window', function ($window) {

            return {
                restrict: 'AE',
                link: function (scope, element, attrs) {
                    var key = attrs.giottoOptions,
                        data = gt.defaults;
                    if (key) data = data[key];

                    var df = angular.toJson(data, 4).split('\n');
                    df = df.map(function (v) {
                        return '    ' + v;
                    }).join('\n');
                    element.html($window.markdown.toHTML(df));
                }
            };
        }]);


    function simpleBarChart () {
        return gt.array.range(-5, 5, 0.5).map((x) => {
            return [x, 1/(1+Math.exp(-x)) - 0.5];
        });
    }

});
