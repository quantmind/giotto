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


test("Test canvas paper", (t) => {
    var gt = giotto.giotto();
    var paper = gt.paper();
    t.ok(paper.element);
    t.ok(paper.element.node());
    t.equal(paper.type, 'canvas');
    t.equal(gt.papers.length, 1);
    t.equal(paper.id, paper.container.attr('id'), "paper id same as paper container DOM id")
    t.end();
});
