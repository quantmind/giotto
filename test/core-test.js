import {test} from 'tape';
import * as giotto from '../';


test("Test giotto function", (t) => {
    t.plan(3);
    t.equal(typeof(giotto.giotto), 'function');
    t.equal(typeof(giotto.version), 'string');
    t.ok(giotto.defaults);
});


test("Test giotto constructor", (t) => {
    var gt = giotto.giotto();
    t.ok(gt instanceof giotto.Giotto);
    t.ok(gt.options);
    t.equal(gt.papers.length, 0);
    t.end();
});


test("Test dataBefore event", (t) => {
    var gt = giotto.giotto(),
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
    var gt = giotto.giotto(),
        data = [];
    t.equal(gt.on("data.test", callback), gt, "return from on should be giotto");
    t.equal(gt.data(data), gt, "return from data should be giotto");
    function callback () {
        t.equal(this, gt, "callback context should be giotto");
        t.equal(this.data(), data);
        t.end();
    }
});


test("Test canvas paper", (t) => {
    var gt = giotto.giotto();
    var paper = gt.paper();
    t.ok(paper.element);
    t.ok(paper.element.node());
    t.equal(paper.type, 'canvas');
    t.equal(gt.papers.length, 1);
    t.equal(paper.id, paper.container.attr('id'), "paper id same as paper container DOM id");
    gt.forEach((p) => {
        t.equal(p, paper);
    })
    t.end();
});