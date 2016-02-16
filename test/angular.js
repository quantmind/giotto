import {test} from 'tape';
import {angularModule} from '../';

var angular = require('angular');
require('angular-mocks');

test("Test giotto angularModule function", (t) => {
    t.plan(3);
    t.equal(typeof(angularModule), 'function', 'angularModule is a function');
    var module = angularModule(angular);
    t.ok(module);
    t.equal(module.name, 'giotto');
});


//test("Test giotto Directive", (t) => {
//    angularModule(angular);
//    module('giotto');
//})
