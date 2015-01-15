    //
    //  Canvas
    //  ======================
    g.group.canvas = function (paper, p) {

        var container = paper.canvas(true),
            elem = p.before ? container.insert('canvas', p.before) : container.append('canvas'),
            ctx = elem.node().getContext('2d'),
            _ = {};

        delete p.before;
        container.selectAll('*').style({"position": "absolute", "top": "0", "left": "0"});
        container.select('*').style({"position": "relative"});

        _.scale = function (group) {
            return d3.canvas.retinaScale(group.context(), p.size[0], p.size[1]);
        };

        _.resize = function (group) {
            d3.canvas.clear(group.context());
            _.scale(group);
            group.resetAxis().render();
        };

        var group = g.group(paper, elem.node(), p, _),
            render = group.render;

        group.render = function () {
            d3.canvas.clear(ctx);
            var factor = group.factor();
            ctx.translate(factor*p.margin.left, factor*p.margin.top);
            return render();
        };

        // clear the group without removing drawing from memory
        group.clear = function () {
            d3.canvas.clear(ctx);
            return group;
        };

        group.context = function () {
            return ctx;
        };

        group.dataAtPoint = function (point, elements) {
            var x = point[0],
                y = point[1],
                active,
                data;
            group.each(function () {
                this.each(function () {
                    active = this.inRange(x, y);
                    if (active === true) elements.push(this);
                    else if (active) elements.push(active);
                });
            });
        };

        group.transform = function (ctx) {
            var factor = group.factor();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(factor*p.margin.left, factor*p.margin.top);
            return group;
        };

        return group.factor(_.scale(group));
    };

    g.canvas.font = function (ctx, opts) {
        opts = extend({}, g.defaults.paper.font, opts);
        ctx.fillStyle = opts.color;
        ctx.font = fontString(opts);
    };

    function canvasMixin(d) {
        d.inRange = function () {};
        d.bbox = function () {};
        return d;
    }

    function canvasBBox (d, nw, ne, se, sw) {
        var target = d.paper().element().node(),
            bbox = target.getBoundingClientRect(),
            p = [bbox.left, bbox.top],
            f = 1/d3.canvas.pixelRatio;
        return {
            nw: {x: f*nw[0] + p[0], y: f*nw[1] + p[1]},
            ne: {x: f*ne[0] + p[0], y: f*ne[1] + p[1]},
            se: {x: f*se[0] + p[0], y: f*se[1] + p[1]},
            sw: {x: f*sw[0] + p[0], y: f*sw[1] + p[1]},
            n: {x: av(nw, ne, 0), y: av(nw, ne, 1)},
            s: {x: av(sw, se, 0), y: av(sw, se, 1)},
            e: {x: av(se, ne, 0), y: av(se, ne, 1)},
            w: {x: av(sw, nw, 0), y: av(sw, nw, 1)}
        };

        function av(a, b, i) {return p[i] + 0.5*f*(a[i] + b[i]);}
    }
