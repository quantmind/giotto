    //
    //  Create an angular module for visualizations
    //
    g.angular = {
        module: function (angular, moduleName, deps) {
            moduleName = moduleName || 'giotto';
            deps = deps || [];

            return angular.module(moduleName, deps)

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
        },

        directive: function (angular, name, vizType, moduleName, injects) {
            moduleName = moduleName || 'giotto';
            injects = injects ? injects.slice() : [];
            var dname = moduleName.toLowerCase() + name.substring(0,1).toUpperCase() + name.substring(1);

            injects.push(function () {
                var injected = arguments;
                return {
                    //
                    // Create via element tag or attribute
                    restrict: 'AE',
                    //
                    link: function (scope, element, attrs) {
                        var viz = element.data(dname);
                        if (!viz) {
                            var options = getOptions(attrs);
                            options.scope = scope;
                            viz = vizType(element[0], options);
                            element.data(dname, viz);
                            scope.$emit('giotto-viz', viz);
                            viz.start();
                        }
                    }
                };
            });

            angular.module(moduleName).directive(dname, injects);
        },
        //
        //  Load all visualizations into angular 'giotto' module
        addAll: function (angular, moduleName, deps, injects) {
            g.angular.module(angular, moduleName, deps);
            //
            // Loop through d3 extensions and create directives
            // for each Visualization class
            angular.forEach(g.viz, function (vizType, name) {
                g.angular.directive(angular, name, vizType, moduleName, injects);
            });
        }
    };
