import {test} from 'tape';
import * as d3 from '../';


test("Test plotting points into a paper", (t) => {
    var gt = d3.giotto({
        data: {
            values: [[1, 1], [2, 2]]
        }
    });

    t.equal(gt.data.size(), 1);

    gt.new({
        draw: 'points'
    });

    //gt.draw();

    t.end();
});
