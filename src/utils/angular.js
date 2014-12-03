    //
    //  Create an angular module for visualizations
    //
    g.angular = {
        module: function (angular, moduleName, deps) {

            if (!g.angular._module) {
                moduleName = moduleName || 'giotto';
                deps = deps || [];

                g.angular._module = angular.module(moduleName, deps)

                    .directive('jstats', function () {
                        return {
                            link: function (scope, element, attrs) {
                                var mode = attrs.mode ? +attrs.mode : 1;
                                require(rcfg.min(['stats']), function () {
                                    var stats = new Stats();
                                    stats.setMode(mode);
                                    scope.stats = stats;
                                    element.append(angular.element(stats.domElement));
                                });
                            }
                        };
                    });
            }
            return g.angular._module;
        },

        directive: function (vizType, name, injects) {
            var mod = g.angular._module;

            if (!mod)
                g.log.warning('No angular module, cannot add directive');

            injects = injects ? injects.slice() : [];
            if (!name) {
                name = vizType.vizName();
                name = mod.name.toLowerCase() + name.substring(0,1).toUpperCase() + name.substring(1);
            }

            injects.push(function () {
                var injected = arguments;
                return {
                    //
                    // Create via element tag or attribute
                    restrict: 'AE',
                    //
                    link: function (scope, element, attrs) {
                        var viz = element.data(name);
                        if (!viz) {
                            var options = getOptions(attrs);
                            options.scope = scope;
                            viz = vizType(element[0], options);
                            element.data(name, viz);
                            scope.$emit('giotto-viz', viz);
                            viz.start();
                        }
                    }
                };
            });

            return mod.directive(name, injects);
        },
        //
        //  Load all visualizations into angular 'giotto' module
        addAll: function (angular, injects) {
            // make sure the module exists
            g.angular.module(angular);
            //
            // Loop through d3 extensions and create directives
            // for each Visualization class
            g.log.info('Adding giotto visualization directives');

            angular.forEach(g.viz, function (vizType) {
                g.angular.directive(vizType, null, injects);
            });
        }
    };
