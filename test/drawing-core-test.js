import {test} from 'tape';
import * as d3 from '../';


test("Test no options for drawings", (t) => {
    var gt = d3.giotto(),
        opts = gt.options();
    t.ok(opts);
    t.equal(opts.points, undefined);
    t.equal(opts.bars, undefined);
    t.equal(opts.line, undefined);
    t.end();
});


test("Test point defaults", (t) => {
    var points = d3.Paper.prototype.points;
    t.ok(d3.quant.isFunction(points));
    t.ok(d3.quant.isObject(points.defaults));
    t.end();
});
