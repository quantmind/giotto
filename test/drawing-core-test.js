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


test("Test accessor override", (t) => {
    var gt = d3.giotto({
        x: 'date',
        papers: {
            "test": {
                "y": "price"
            }
        }
    });
    t.equal(gt.$scope.x, 'date');
    t.equal(gt.$scope.y, undefined);

    var paper = gt.new({name: "test"});
    t.equal(paper.name, 'test');
    t.equal(paper.$scope.x, 'date');
    t.equal(paper.$scope.y, 'price');

    var points = paper.points();
    t.equal(points.marks, "points");
    t.equal(points.$scope.x, 'date');
    t.equal(points.$scope.y, 'price');
    t.end();
})
