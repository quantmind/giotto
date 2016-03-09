import {test} from 'tape';
import * as d3 from '../';


test("Test active plugins", (t) => {
    var gt = d3.giotto(),
        options = gt.options();
    t.equal(options.responsive, true);
    t.equal(options.transitions, true);
    t.equal(options.grid, false);
    t.equal(options.axis, false);
    t.equal(options.background, false);
    t.end();
});



