

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    angular.module('giottoweb', ['lux.bs'])

        .controller('GiottoExample', ['$scope', '$location', function (scope, $loction) {
            scope.giottoThemes = [
                {
                    name: 'light',
                    title: 'Light theme',
                    url: lux.media('giottoweb/light.min.css')
                },
                {
                    name: 'dark',
                    title: 'Dark theme',
                    url: lux.media('giottoweb/dark.min.css')
                }
            ];

            scope.currentTheme = 'light';

            scope.selectTheme = function (e, theme) {
                if (e) e.preventDefault();
                if (theme && theme !== scope.currentTheme) {
                    var url = lux.media('giottoweb/' + theme + '.min.css'),
                        link = angular.element(lux.querySelector(document, '#giotto-theme'));
                    link.attr('href', url);
                    scope.currentTheme = theme;
                    scope.$broadcast('changeTheme', theme);
                }
            };

            scope.selectTheme(null, getParameterByName('style'));
        }]);