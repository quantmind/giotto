import {test} from 'tape';
import * as d3 from '../';


test("Test active plugins", (t) => {
    var plugins = d3.Plugin.$plugins;

    t.equal(plugins.get('responsive').active, true, 'responsive active');
    t.equal(plugins.get('grid').active, false, 'grid not active');
    t.equal(plugins.get('axes.x').active, false, 'axes.x not active');
    t.equal(plugins.get('axes.y').active, false, 'axes.y not active');
    t.equal(plugins.get('background').active, false, 'background not active');

    //t.equal(plugins.get('transitions.merge').active, true, 'transitions.merge is active');
    t.end();
});



test("Test margin plugin", (t) => {
    var gt = d3.giotto(),
        paper = gt.new(),
        margin = paper.$scope.$margin;

    t.ok(margin instanceof d3.Plugin);
    t.ok(paper.$scope.$plugins.indexOf(margin) > -1, 'margin plugin equivalence');

    t.equal(margin.$scope.$self, paper, 'margin $self should be the paper');
    t.equal(margin.paper, paper, 'margin paper should be the paper');

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
        margin2 = paper2.$scope.$margin;

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


test("Test margins", (t) => {
    var gt = d3.giotto();
    var paper = gt.new({
        width: 600,
        height: 400,
        factor: 1,
        margin: {
            right: 30
        }
    });
    t.equal(paper.factor, 1, 'paper factor is 1');
    t.equal(paper.factor, paper.$scope.$factor);
    t.equal(paper.marginLeft, 20);
    t.equal(paper.marginRight, 30);
    t.equal(paper.marginTop, 20);
    t.equal(paper.marginBottom, 20);
    t.end();
});


test("Test margins override", (t) => {
    var gt = d3.giotto({margin: 60});
    t.equal(gt.$scope.margin, 60);
    var paper = gt.new();
    t.equal(paper.$scope.$margin.left, 60);
    t.equal(paper.$scope.$margin.right, 60);
    t.equal(paper.$scope.$margin.top, 60);
    t.equal(paper.$scope.$margin.bottom, 60);
    //var paper2 = gt.new({
    //    margin: {
    //        left: 100
    //    }
    //});
    //t.equal(paper2.$scope.$margin.left, 60);
    //t.equal(paper2.$scope.$margin.right, 100);
    //t.equal(paper2.$scope.$margin.top, 60);
    //t.equal(paper2.$scope.$margin.bottom, 60);
    t.end();
});
