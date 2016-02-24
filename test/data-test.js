import {test} from 'tape';
import * as d3 from '../';


test("Test dataBefore event", (t) => {
    var gt = d3.giotto(),
        data = [];
    t.equal(gt.on("dataBefore.test", callback), gt, "return from on should be giotto");
    t.equal(gt.data(data), gt, "return from data should be giotto");
    function callback (d) {
        t.equal(this, gt, "callback context should be giotto");
        t.equal(d, data);
        t.equal(this.data(), undefined);
        t.end();
    }
});

test("Test data event", (t) => {
    var gt = d3.giotto(),
        data = [];
    t.equal(gt.on("data.test", callback), gt, "return from on should be giotto");
    t.equal(gt.data(data), gt, "return from data should be giotto");
    function callback () {
        t.equal(this, gt, "callback context should be giotto");
        t.equal(this.data(), data);
        t.end();
    }
});
