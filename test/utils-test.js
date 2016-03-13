import {test} from 'tape';
import * as d3 from '../';



test("Test orderedMap", (t) => {
    var map = d3.orderedMap();
    t.equal(map.length, 0);
    t.equal(map.has('foo'), false);
    map.set('foo', 4);
    map.set('bla', 'foo');
    map.set('pippo', 6);
    t.equal(map.length, 3);
    t.ok(map.has('foo'));
    t.ok(map.has('bla'));
    t.ok(map.has('pippo'));
    t.equal(map.get('foo'), 4);
    t.equal(map.get('bla'), 'foo');
    t.equal(map.get('pippo'), 6);
    t.deepEqual(map.keys(), ['foo', 'bla', 'pippo']);
    t.deepEqual(map.values(), [4, 'foo', 6]);

    map.set('bla', 99);
    t.equal(map.length, 3);
    t.deepEqual(map.keys(), ['foo', 'bla', 'pippo']);
    t.deepEqual(map.values(), [4, 99, 6]);

    map.clear();
    t.equal(map.length, 0);
    t.deepEqual(map.keys(), []);
    t.deepEqual(map.values(), []);
    t.end();
});
