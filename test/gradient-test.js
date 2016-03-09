import {test} from 'tape';
import * as d3 from '../';


test("Test gradient object", (t) => {
    var grad = d3.gradient();
    t.equal(grad.mode, undefined);
    t.equal(grad.context, null);
    t.ok(d3.quant.isArray(grad.colors));
    t.equal(grad.colors.length, 1);
    t.equal(grad.xscale(0), 0);
    t.equal(grad.xscale(1), 1);
    t.equal(grad.yscale(0), 0);
    t.equal(grad.yscale(1), 1);
    t.end();
});

test("Test background opacity", (t) => {
    var grad = d3.gradient({color: '#444', opacity: 0.1});
    t.equal(grad.mode, undefined);
    t.equal(grad.context, null);
    t.ok(d3.quant.isArray(grad.colors));
    t.equal(grad.colors.length, 1);
    t.equal(''+grad.colors[0].color, 'rgba(68, 68, 68, 0.1)');
    t.end();
});


test("Test background svg", (t) => {
    var grad = d3.gradient({color: '#444'});
    var context = grad.draw();
    t.ok(context);
    t.equal(context.fillStyle, 'rgb(68, 68, 68)');
    t.equal(context.offsets.length, 0);
    t.equal(context.rect.x, 0);
    t.equal(context.rect.y, 0);
    t.equal(context.rect.width, 1);
    t.equal(context.rect.height, 1);
    t.end();
});


test("Test gradient svg", (t) => {
    var grad = d3.gradient({colors: ['#444', '#666']});
    t.equal(grad.colors.length, 2);
    t.equal(grad.mode, 'x');
    var context = grad.draw();
    t.equal(context.offsets.length, 2);
    t.equal(context.offsets[0].offset, 0);
    t.equal(context.offsets[1].offset, 1);
    t.equal(context.fillStyle, context);
    t.end();
});
