import {test} from 'tape';
import * as d3 from '../';



test("Test plotting points into a paper", (t) => {
    var gt = d3.giotto({
        data: {
            fields: ['x', 'y'],
            values: [[1, 1], [2, 2]]
        }
    });

    t.equal(gt.data.size(), 1);

    gt.new({
        draw: 'points'
    });

    gt.draw();
    var draws = gt.papers[0].draws;
    t.equal(draws.length, 1);
    var points = draws[0];
    t.equal(points.marks, 'points');

    var listener = gt.on('data');
    t.notOk(listener);
    listener = gt.on('data.' + points.paper.id);
    t.ok(listener);

    t.end();
});
