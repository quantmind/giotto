import {test} from 'tape';
import * as d3 from '../';


test("Test giotto function", (t) => {
    t.plan(4);
    t.equal(typeof(d3.giotto), 'function');
    t.equal(typeof(d3.version), 'string');
    t.equal(d3.giotto.version, d3.version);
    t.ok(d3.defaults);
});


test("Test giotto constructor", (t) => {
    var gt = d3.giotto();
    t.ok(gt.options());
    t.equal(gt.papers.length, 0);
    t.ok(d3.quant.isFunction(gt.on));
    t.end();
});


test("Test giotto options", (t) => {
    var gt = d3.giotto();
    t.ok(gt.options);
    t.equal(gt.papers.length, 0);
    t.ok(d3.quant.isFunction(gt.on));
    t.end();
});


test("Test canvas paper", (t) => {
    var gt = d3.giotto();
    var paper = gt.paper();
    t.ok(paper.element);
    t.ok(paper.element.node());
    t.equal(paper.type, 'canvas');
    t.equal(gt.papers.length, 1);
    t.equal(paper.id, paper.container.attr('id'),
        "paper id same as paper container DOM id");
    gt.forEach((p) => {
        t.equal(p, paper);
    });
    t.equal(paper.size[0], 400);
    t.equal(paper.size[1], 300);
    paper.size[0] = 600;
    t.equal(paper.size[0], 400);
    t.end();
});


test("Test canvas size", (t) => {
    var gt = d3.giotto();
    var paper = gt.paper({width: 600, height: 400});
    t.ok(paper.element);
    t.ok(paper.element.node());
    t.equal(paper.domWidth, 600);
    t.equal(paper.domHeight, 400);
    t.equal(paper.size[0], 600);
    t.equal(paper.size[1], 400);
    t.end();
});

test("Test canvas size percentage", (t) => {
    var gt = d3.giotto();
    var paper = gt.paper({width: 600, height: '50%'});
    t.ok(paper.element);
    t.ok(paper.element.node());
    t.equal(paper.domWidth, 600);
    t.equal(paper.domHeight, 300);
    t.equal(paper.size[0], 600);
    t.equal(paper.size[1], 300);
    t.end();
});

test("Test margins", (t) => {
    var gt = d3.giotto();
    var paper = gt.paper({width: 600, height: 400});
    t.equal(paper.marginLeft, 20*paper.factor);
    t.equal(paper.marginRight, 20*paper.factor);
    t.equal(paper.marginTop, 20*paper.factor);
    t.equal(paper.marginBottom, 20*paper.factor);
    t.end();
});

test("Test canvas layers", (t) => {
    var gt = d3.giotto();
    var paper = gt.paper();
    t.equal(paper.type, 'canvas');
    t.equal(gt.papers.length, 1);
    t.equal(paper.background.type, 'canvas');
    t.equal(paper.drawings.type, 'canvas');
    t.equal(paper.foreground.type, 'canvas');

    t.equal(paper.background.paper, paper);
    t.equal(paper.drawings.paper, paper);
    t.equal(paper.foreground.paper, paper);
    var context = paper.drawings.context;
    t.ok(context);
    t.end();
});

test("Test svg layers", (t) => {
    var gt = d3.giotto();
    var paper = gt.paper({type: 'svg'});
    t.equal(paper.type, 'svg');
    t.equal(gt.papers.length, 1);
    t.equal(paper.background.type, 'svg');
    t.equal(paper.drawings.type, 'svg');
    t.equal(paper.foreground.type, 'svg');

    t.equal(paper.background.paper, paper);
    t.equal(paper.drawings.paper, paper);
    t.equal(paper.foreground.paper, paper);
    t.end();
});


test("Test paper options", (t) => {
    var gt = d3.giotto({
        papers: {
            foo: {
                background: '#ccc'
            },
            bla: {
                background: '#000'
            }
        }
    });
    var paper = gt.paper({name: 'foo'});
    t.equal(paper.name, 'foo');
    t.end();
});


test("Test multiple papers", (t) => {
    var gt = d3.giotto();
    var paper = gt.paper();
    t.ok(paper.element);
    t.ok(paper.element.node());
    //TODO: fix this test!
    //t.equal(paper.container.style('position'), 'relative');
    t.end();
});
