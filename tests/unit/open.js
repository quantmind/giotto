require(['d3ext.js', 'angular', 'angular-mocks'], function (d3ext) {
    "use strict";
    //
    //
    function luxInjector () {
        return angular.injector(['ng', 'ngMock', 'lux']);
    }
