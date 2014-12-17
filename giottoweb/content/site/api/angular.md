title: GiottoJS - AngularJS integration


GiottoJs comes with a small utility for facilitating integration with [AngularJs][].
Once angular is loaded, a module can be created using the utility function

    var ng = d3.giotto.angular;

    ng.module(angular);

The function create a mdoule named 'giotto' by default. The call the module in a different name pass the module name as second parameter:

    ng.module(nagular, 'mymodule');

