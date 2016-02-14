import {test} from 'tape';
import {giotto, Giotto} from '../';


test("Test giotto function", (t) => {
    t.plan(3);
    t.equal(typeof(giotto), 'function');
    t.equal(typeof(giotto.version), 'string');
    t.ok(giotto.defaults);
});

test("Test giotto constructor", (t) => {
    var gt = giotto();
    t.ok(gt instanceof Giotto);
    t.ok(gt.options);
    t.equal(gt.papers.length, 0);
    t.end();
});
