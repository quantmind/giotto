import {test} from 'tape';
import * as d3 from '../';


test("Test plotting points into a paper", (t) => {
    var gt = d3.giotto();
    var paper = gt.paper();
    paper.data([[1,1], [2,2]]);
    t.end();
});
