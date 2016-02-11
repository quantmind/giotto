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

        //
        //  Get Options for a Visualization Directive
        //  ==============================================
        //
        //  Obtain information from
        //  * javascript object
        //  * element attributes
        //  * scope variables
        ag.getOptions = function (scope, attrs, name) {
            var key = attrs[name],
                exclude = [name, 'options', 'class', 'style'],
                jsOptions;

            if (typeof attrs.options === 'string')
                key = attrs.options;

            // Try the scope first
            if (key) {
                jsOptions = scope[key];

                // try the global javascript object
                if (!jsOptions)
                    jsOptions = getRootAttribute(key);
            }

            if (typeof jsOptions === 'function')
                jsOptions = jsOptions();

            if (!jsOptions) jsOptions = {};

            var attrOptions = {};
            forEach(attrs, function (value, name) {
                if (name.substring(0, 1) !== '$' && exclude.indexOf(name) === -1)
                    attrOptions[name] = value;
            });
            return {js: jsOptions, attr: attrOptions};
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

                    //
                    //  Giotto Visualization Collection
                    //  ====================================
                    //
                    //  Directive to aggregate giotto visualizations with
                    //  close interaction
                    .directive('giottoCollection', function () {

                        return {
                            restrict: 'AE',

                            controller: ['$scope', function (scope) {
                                scope.giottoCollection = ag.mixin(g.viz.collection());
                            }],

                            link: function (scope, element, attrs) {
                                var o = ag.getOptions(scope, attrs, 'giottoCollection');
                                scope.giottoCollection
                                    .options(o.attr)
                                    .options(o.js)
                                    .scope(scope).start();
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
            name = mod.name.toLowerCase() + name.substring(0,1).toUpperCase() + name.substring(1);

            function startViz(scope, element, o, options, injected) {
                var collection = scope.giottoCollection,
                    key;

                // Get the key for the collection (if a collection is available)
                if (collection) {
                    if (isString(options)) {
                        key = options;
                        options = null;
                    } else
                        key = collection.size() + 1;
                }

                // Add injects to the scope object
                for (var i=0; i<injected.length; ++i)
                    scope[injects[i]] = injected[i];

                // Creat the visualization
                var viz = vizType(element[0], o.attr)
                            .options(o.js)
                            .options(options);
                //
                // Add angular functions
                viz = ag.mixin(viz).scope(scope);

                element.data(name, viz);

                if (collection)
                    collection.set(key, viz);
                else {
                    scope.$emit('giotto-viz', viz);
                    viz.start();
                }
            }

            //  Directive implementation for a visualization other than a
            //  collection
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
                            var key = attrs[name],
                                o = ag.getOptions(scope, attrs, name),
                                deps = o.js.require || o.attr.require;
                            if (deps) {
                                if (!g._.isArray(deps)) deps = [deps];
                                require(deps, function (opts) {
                                    startViz(scope, element, o, opts, injected_arguments);
                                });
                            } else {
                                startViz(scope, element, o, key, injected_arguments);
                            }
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
                var name = vizType.vizName ? vizType.vizName() : null;
                if (name && name !== 'collection')
                    g.angular.directive(vizType, name, injects);
            });

            return ag;
        };

        return ag;
    }());
