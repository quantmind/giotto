    //
    //  Optional Angular Integration
    //  ==================================
    //
    //  To create the angular module containing giotto directive:
    //
    //      d3.giotto.angular.module(angular)
    //
    //  To add all visualizations to the module
    //
    //      d3.giotto.angular.addAll()
    //
    //  To register the module and add all visualizations
    //
    //      d3.giotto.angular.module(angular).addAll();
    //
    g.angular = (function () {
        var ag = {},
            mod;

        // Mixin for adding scope method to visualization objects
        ag.mixin = function (d) {
            var scope;

            d.scope = function (_) {
                if (!arguments.length) return scope;
                var opts = d.options();
                scope = _;
                if (isFunction(opts.angular))
                    opts.angular(d, opts);

                return d;
            };

            if (d.tick) {
                var tick = d.tick;

                d.tick = function() {
                    if (scope && scope.stats)
                        scope.stats.begin();
                    tick();
                    if (scope && scope.stats)
                        scope.stats.end();
                };
            }

            return d;
        };

        ag.module = function (angular, moduleName, deps) {

            if (!arguments.length) return mod;

            if (!mod) {
                moduleName = moduleName || 'giotto';
                deps = deps || [];

                mod = angular.module(moduleName, deps);

                mod.config(['$compileProvider', function (compileProvider) {

                        mod.directive = function (name, factory) {
                            compileProvider.directive(name, factory);
                            return (this);
                        };

                    }])

                    .directive('giottoCollection', function () {

                        return {
                            restrict: 'AE',

                            controller: ['$scope', function (scope) {
                                scope.giottoCollection = ag.mixin(g.collection());
                            }],

                            link: function (scope, element, attrs) {
                                var options = getOptions(attrs),
                                    deps = options.require;
                                if (deps) {
                                    if (!g._.isArray(deps)) deps = [deps];
                                    require(deps, function (opts) {
                                        extend(options, opts);
                                        scope.giottoCollection.options(options).scope(scope).start();
                                    });
                                } else
                                    scope.giottoCollection.options(options).scope(scope).start();
                            }
                        };
                    })

                    // Directive to privide frame stats
                    .directive('jstats', function () {
                        return {
                            link: function (scope, element, attrs) {
                                var mode = attrs.mode ? +attrs.mode : 1;
                                require(['stats'], function () {
                                    var stats = new Stats();
                                    stats.setMode(mode);
                                    scope.stats = stats;
                                    element.append(angular.element(stats.domElement));
                                });
                            }
                        };
                    });
            }
            return ag;
        };

        ag.directive = function (vizType, name, injects) {

            if (!mod) {
                g.log.warn('No angular module, cannot add directive');
                return;
            }

            injects = injects ? injects.slice() : [];

            // Create directive from Viz name if not provided
            if (!name) {
                name = vizType.vizName();
                name = mod.name.toLowerCase() + name.substring(0,1).toUpperCase() + name.substring(1);
            }

            function startViz(scope, element, options, injected) {
                var collection = scope.giottoCollection;

                for (var i=0; i<injected.length; ++i)
                    options[injects[i]] = injected[i];

                var viz = ag.mixin(vizType(element[0])).options(options).scope(scope);
                element.data(name, viz);

                if (collection) {
                    var key = options.key || collection.size() + 1;
                    collection.set(key, viz);
                } else {
                    scope.$emit('giotto-viz', viz);
                    viz.start();
                }
            }

            injects.push(function () {
                var injected_arguments = arguments;
                return {
                    //
                    // Create via element tag or attribute
                    restrict: 'AE',
                    //
                    link: function (scope, element, attrs) {
                        var viz = element.data(name);
                        if (!viz) {
                            var options = getOptions(attrs),
                                deps = options.require;
                            if (deps) {
                                if (!g._.isArray(deps)) deps = [deps];
                                require(deps, function (opts) {
                                    extend(options, opts);
                                    startViz(scope, element, options, injected_arguments);
                                });
                            } else
                                startViz(scope, element, options, injected_arguments);
                        }
                    }
                };
            });

            return mod.directive(name, injects);
        };

        //  Load all visualizations into angular 'giotto' module
        ag.addAll = function (injects) {
            //
            // Loop through d3 extensions and create directives
            // for each Visualization class
            g.log.info('Adding giotto visualization directives');

            angular.forEach(g.viz, function (vizType) {
                g.angular.directive(vizType, null, injects);
            });

            return ag;
        };

        return ag;
    }());
