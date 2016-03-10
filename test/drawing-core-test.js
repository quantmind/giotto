import {test} from 'tape';
import * as d3 from '../';


test("Test no options for drawings", (t) => {
    var gt = d3.giotto();
    t.equal(gt.$scope.points, undefined);
    t.equal(gt.$scope.bars, undefined);
    t.equal(gt.$scope.line, undefined);
    t.end();
});


test("Test point defaults", (t) => {
    var points = d3.Paper.prototype.points;
    t.ok(d3.quant.isFunction(points));
    t.ok(d3.quant.isObject(points.defaults));
    t.end();
});
