require(['d3ext.js', 'jquery', 'angular'], function (d3ext, $) {
    "use strict";

    angular.element = $;
    window.$ = $;

    angular.module('d3ext', [])
            .controller('page', ['$scope', function ($scope) {
                //
            }])
            .directive('sunBurst', d3ext.vizDirectiveFactory(d3ext.SunBurst));

    // Bootstrap
    angular.bootstrap(document, ['d3ext']);
});