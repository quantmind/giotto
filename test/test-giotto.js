import {test} from 'tape';
import * as gt from '../';


test("version matches package.json", (t) => {
    t.equal(gt.version, require("../package.json").version);
    t.end();
});

