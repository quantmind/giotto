    //
    //  Canvas
    //  ======================
    g.group.canvas = function (paper, p) {

        var container = paper.canvas(true),
            elem = p.before ? container.insert('canvas', p.before) : container.append('canvas'),
            ctx = elem.node().getContext('2d'),
            _ = canvas_implementation(paper, p);

        delete p.before;
        container.selectAll('*').style({"position": "absolute", "top": "0", "left": "0"});
        container.select('*').style({"position": "relative"});

        var group = g.group(paper, elem.node(), p, _),
            render = group.render;

        group.render = function () {
            var factor = _.clear(group, p.size);
            ctx.translate(factor*p.margin.left, factor*p.margin.top);
            return render();
        };

        group.context = function () {
            return ctx;
        };

        group.dataAtPoint = function (point, elements) {
            var x = point[0],
                y = point[1],
                data;
            group.each(function () {
                this.each(function () {
                    if (this.inRange(x, y)) elements.push(this);
                });
            });
        };

        group.transform = function (ctx) {
            var factor = group.factor();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(factor*p.margin.left, factor*p.margin.top);
            return group;
        };

        group.setBackground = function (b, context) {
            context = context || ctx;
            if (isObject(b)) context.fillStyle = d3.canvas.rgba(b.fill, b.fillOpacity);
            else if (isString(b)) context.fillStyle = b;
            return group;
        };

        return group.factor(_.scale(group));
    };