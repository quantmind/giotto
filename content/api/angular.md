title: GiottoJS - AngularJS integration


GiottoJs comes with a small utility for facilitating integration with [AngularJs][].
Once angular is loaded, the giotto module can be created using the following snippet:

    var ng = d3.giotto.angular;

    ng.module(angular);

The function create a module named 'giotto' by default. Alternatively, pass the
module name as second parameter:

    ng.module(angular, 'mymodule');

To add all giotto directives to the module:

    ng.module(angular).addAll();

and add the 'giotto' name to the list of module to bootstrap:

    angular.bootstrap(document, [..., 'giotto', ...]);

