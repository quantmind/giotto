import {data} from '../data/index';
import {extend} from 'd3-quant';
import {default as giotto} from '../core/main';

//
//  Giotto Angular Integration
//  ==================================
//
//  To create the angular module containing giotto directive:
//
//      giotto.angular.module(angular)
//
//  To add all visualizations to the module
//
//      d3.giotto.angular.addAll()
//
//  To register the module and add all visualizations
//
//      d3.giotto.angular.module(angular).addAll();
//
export function angularModule (angular) {

    var module = angular.module('giotto', [])
        .constant('giottoDefaults', {})

        .factory('getOptions', ['$window', getOptionsFactory])

        .run(['$rootScope', function (scope) {
            if (!data.$eval)
                data.$eval = function (expr, locals) {
                    return scope.$eval(expr, locals);
                };
        }])

        // Outer giotto directive
        .directive('giotto', ['getOptions', 'giottoDefaults', '$http',
            function (getOptions, giottoDefaults, $http) {
                return {
                    restrict: 'AE',

                    controller: ['$scope', 'giottoDefaults', function (scope) {
                        // Add a giotto queue to the scope
                        scope.giottoQueue = [];
                    }],

                    link: giottoLayout(getOptions, giottoDefaults, $http)
                };
            }]
        )

        .directive('giottoPaper', ['getOptions', 'giottoDefaults',
            function (getOptions, giottoDefaults) {
                return {
                    restrict: 'AE',
                    link: giottoPaper(getOptions, giottoDefaults)
                };
            }]
        )

        .directive('giottoStats', ['getOptions', '$window',
            function (getOptions, $window) {
                return {
                    restrict: 'AE',
                    link: giottoStats(getOptions, $window)
                };
            }]
        );


    function giottoLayout(getOptions, giottoDefaults, $http) {

        return function (scope, element, attrs) {
            var options = getOptions(scope, attrs, 'giotto'),
                queue = scope.giottoQueue;

            // Set layout options for giotto instance
            if (queue && !queue.length)
                queue.push([element[0], {}]);

            //
            if (options.name && /^(http(s)?:)?\/\//.test(options.name)) {
                $http.get(options.name).then(function (response) {
                    giottoPapers(scope, response.data, giottoDefaults);
                }, function () {

                });
            } else {
                giottoPapers(scope, options, giottoDefaults);
            }
        };
    }

    function giottoPaper(getOptions, giottoDefaults) {

        return function (scope, element, attrs) {
            var options = getOptions(scope, attrs, 'giottoPaper'),
                gt = scope.giottoQueue;

            // No giotto queue in the scope, create giotto
            if (!gt) {
                scope.giottoQueue = gt = [];
                gt.push([element[0], {}]);
                giottoPapers(scope, options, giottoDefaults)
            } else
                gt.push([element[0], options]);
        };
    }

    //
    // Create giotto and papers
    function giottoPapers(scope, options, defaults) {
        var queue = scope.giottoQueue,
            gt = giotto(extend(true, {}, defaults, options));

        if (queue) {
            delete scope.giottoQueue;
            queue.forEach( (eo) => {
                gt.new(eo[0], eo[1]);
            });
            gt.draw();
        }
    }

    function giottoStats(getOptions, $window) {

        return function (scope, element, attrs) {
            var options = getOptions(scope, attrs, 'giottoStats');
            var mode = options.mode ? +options.mode : 1;
            require(['stats'], () => {
                var stats = new $window.Stats();
                stats.setMode(mode);
                scope.stats = stats;
                element.append(angular.element(stats.domElement));
            });
        };
    }

    //
    //  Get Options for a Visualization Directive
    //  ==============================================
    //
    //  Obtain information from
    //  * javascript object
    //  * element attributes
    //  * scope variables
    function getOptionsFactory($window) {
        return getOptions;

        function getOptions(scope, attrs, name) {
            var key = attrs[name],
                exclude = [name, 'class', 'style'],
                options;

            if (key) {
                // Try the scope first
                if (scope) options = getAttribute(scope, key);

                if (!options) options = getAttribute($window, key);

                if (!options) options = {name: key};
            }
            if (!options) options = {};

            angular.forEach(attrs, (value, name) => {
                if (name.substring(0, 1) !== '$' && exclude.indexOf(name) === -1)
                    options[name] = value;
            });
            return options;
        }

        function getAttribute(obj, name) {
            var bits = name.split('.');

            for (var i = 0; i < bits.length; ++i) {
                obj = obj[bits[i]];
                if (!obj) break;
            }
            if (typeof obj === 'function')
                obj = obj();

            return obj;
        }
    }

    return module;
}
