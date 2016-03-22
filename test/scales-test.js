import {test} from 'tape';
import * as d3 from '../';


test("Test scale override", (t) => {
    var gt = d3.giotto(),
        paper = gt.new(),
        color = paper.$scope.$scales.get('color');
    t.ok(color instanceof d3.Plugin);
    t.equal(color.$scope.range, 'category10');

    global.myRange = function () {
        return ['#ccc', '#ddd'];
    };

    paper = d3.giotto({
        scales: {
            color: {
                range: 'myRange()'
            }
        }
    }).new();

    color = paper.$scope.$scales.get('color');
    t.equal(color.$scope.range, 'myRange()');

    delete global.myRange;
    t.end();
});



test("Test time scale", (t) => {
    var gt = d3.giotto({
        scales: {
            x: {
                type: "time",
                domain: "foo.date"
            }
        },
        data: {
            name: "foo",
            values: [
                {date: '2016-03-01', y: "300"},
                {date: '2016-03-02', y: "400"},
                {date: '2016-03-03', y: "350"}
            ]
        }
    });
    var paper = gt.new(),
        x = paper.$scope.$scales.get('x');

    t.ok(x instanceof d3.Plugin);
    t.equal(x.$scope.range, 'width');
    t.equal(x.$scope.type, 'time');
    t.equal(x.$scope.domain, 'foo.date');

    var scale = paper.scale('x');
    t.ok(d3.quant.isFunction(scale));
    var domain = scale.domain();
    t.equal(domain.length, 2);
    t.deepEqual(domain[0], new Date('2016-03-01'));
    t.deepEqual(domain[1], new Date('2016-03-03'));
    t.end();
});


test("Test override defaults", (t) => {
    var gt = d3.giotto({
        x: 'date',
        scales: {
            x: {
                type: "time"
            }
        },
        data: {
            name: "foo",
            values: [
                {date: '2016-03-01', price: 300},
                {date: '2016-03-02', price: 400},
                {date: '2016-03-03', price: 350}
            ]
        }
    });
    var paper = gt.new({
            y: 'price'
        }),
        x = paper.$scope.$scales.get('x'),
        y = paper.$scope.$scales.get('y');

    var scale_x = paper.scale('x'),
        scale_y = paper.scale('y');

    t.ok(scale_x);
    t.ok(scale_y);

    t.ok(x instanceof d3.Plugin);
    t.equal(x.$scope.range, 'width');
    t.equal(x.$scope.$currentScaleType, 'time');
    t.equal(x.$scope.$from, 'foo.date');

    t.ok(y instanceof d3.Plugin);
    t.equal(y.$scope.range, 'height');
    t.equal(y.$scope.$currentScaleType, 'linear');
    t.equal(y.$scope.$from, 'foo.price');

    t.end();
});
