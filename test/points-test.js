import {test} from 'tape';
import * as giotto from '../';

test("Test plotting points into a paper", (t) => {
    var gt = giotto.giotto();
    var paper = gt.paper();
    paper.data([[1,1], [2,2]]);
    t.end();
});
