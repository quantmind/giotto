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
        .value('giottoDefaults', {})

        .factory('getOptions', ['$window', getOptionsFactory])

        .directive('giotto', ['getOptions', function (getOptions) {
            return {
                restrict: 'AE',

                controller: ['$scope', 'giottoDefaults', function (scope, giottoDefaults) {
                    // Add a giotto instance to the scope
                    scope.giotto = giotto(giottoDefaults);
                }],

                link: giottoLayout(getOptions)
            };
        }])

        .directive('giottoPaper', ['getOptions', function (getOptions) {
            return {
                restrict: 'AE',
                link: giottoPaper(getOptions)
            };
        }])

        .directive('giottoStats', ['getOptions', '$window', function (getOptions, $window) {
            return {
                restrict: 'AE',
                link: giottoStats(getOptions, $window)
            };
        }]);


    function giottoLayout(getOptions) {

        return function (scope, element, attrs) {
            var options = getOptions(scope, attrs, 'giotto');
            // Set layout options for giotto instance
            scope.giotto.setOptions(options);
        };
    }

    function giottoPaper(getOptions) {

        return function (scope, element, attrs) {
            var options = getOptions(scope, attrs, 'giottoPaper'),
                gt = scope.giotto;

            // No giotto in the scope, create one
            if (!gt) {
                gt = giotto();
                scope.giotto = gt;
            }


            gt.paper(element[0], options);
        };
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
