import {test} from 'tape';
import * as d3 from '../';



test("Test capfirst", (t) => {
    t.equal(d3.utils.capfirst('ciao'), 'Ciao');
    t.equal(d3.utils.capfirst('ciaoLuca'), 'CiaoLuca');
    t.equal(d3.utils.capfirst('Ciaoluca'), 'Ciaoluca');
    t.end();
});
