import {test} from 'tape';
import * as d3 from '../';


test("Test active plugins", (t) => {
    var plugins = d3.Plugin.$plugins;

    t.equal(plugins.get('responsive').$active, true, 'responsive active');
    t.equal(plugins.get('transitions').$active, true, 'transitions active');
    t.equal(plugins.get('grid').$active, false, 'grid not active');
    t.equal(plugins.get('axis').$active, false, 'axis not active');
    t.equal(plugins.get('background').$active, false, 'background not active');
    t.end();
});



test("Test margin plugin", (t) => {
    var gt = d3.giotto(),
        paper = gt.new(),
        margin = paper.$scope.$margin;

    t.equal(margin, paper.$scope.$plugins.get('margin'), 'margin plugin equivalence');

    t.equal(margin.parent, paper, 'margin parent should be the paper');

    t.equal(margin.left, 20);
    t.equal(margin.right, 20);
    t.equal(margin.top, 20);
    t.equal(margin.bottom, 20);
    t.equal(margin.active, true);

    var paper2 = gt.new({
        margin: {
            top: 40,
            right: 10,
            bottom: 45
        }}),
        margin2 = paper2.$scope.$plugins.get('margin');

    t.equal(margin2.left, 20);
    t.equal(margin2.right, 10);
    t.equal(margin2.top, 40);
    t.equal(margin2.bottom, 45);
    t.equal(margin2.active, true);

    t.equal(margin.left, 20);
    t.equal(margin.right, 20);
    t.equal(margin.top, 20);
    t.equal(margin.bottom, 20);
    t.equal(margin.active, true);

    t.end();
});
