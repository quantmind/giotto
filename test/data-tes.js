import {test} from 'tape';
import * as d3 from '../';


test("Test dataBefore event", (t) => {
    var gt = d3.giotto(),
        data = {
            values: [[1, 1], [2, 2], [3, 2]],
            name: 'test'
        };
    t.equal(gt.on("dataBefore.test", callback), gt, "return from on should be giotto");
    t.equal(gt.data(data), gt, "return from data should be giotto");

    function callback (e, d) {
        t.equal(e.current, gt, "callback context should be giotto");
        t.equal(d.length, 1);
        //t.equal(d[0].name, 'test', 'data name is test');
        //t.deepEqual(d[0].data, data.values, 'data is the same as values');
        t.equal(e.current, gt, 'event current element is giotto');

        data = gt.data();
        t.ok(data);
        t.end();
    }
});


test("Test data event", (t) => {
    var gt = d3.giotto(),
        data = {
            values: [[1, 1], [2, 2], [3, 2]],
            name: 'test'
        };
    t.equal(gt.on("data.test", callback), gt, "return from on should be giotto");
    t.equal(gt.data(data), gt, "return from data should be giotto");
    function callback (e) {
        t.equal(e.current, gt, "callback context should be giotto");
        var value = e.current.data();
        t.ok(value);
        t.end();
    }
});
