    //
    //  Fill plugin
    //  ================
    //
    //  A plugin which add the ``setBackground`` function to a group
    g.paper.plugin('fill', {

        init: function (group) {

            var type = group.type();

            group.fill = function (opts) {
                if (!isObject(opts)) opts = {fill: opts};

                return group.add(type === 'svg' ? FillSvg : FillCanvas)
                            .options(opts);
            };

            if (type === 'svg')
                group.setBackground = function (b, o) {
                    if (!o) return;

                    if (isObject(b)) {
                        if (b.fillOpacity !== undefined)
                            o.attr('fill-opacity', b.fillOpacity);
                        b = b.fill;
                    }
                    if (isString(b))
                        o.attr('fill', b);
                    else if(isFunction(b))
                        b(o);
                    return group;
                };
            else
                group.setBackground = function (b, context) {
                    var fill = b;
                    context = context || group.context();
                    if (isObject(fill)) fill = fill.fill;

                    if (isFunction(fill))
                        fill(group.element());
                    else if (isObject(b))
                        context.fillStyle = d3.canvas.rgba(b.fill, b.fillOpacity);
                    else if (isString(b))
                        context.fillStyle = b;
                    return group;
                };

            function FillSvg () {
                var rect = group.element().selectAll('rect').data([true]),
                    fill = this.fill;
                rect.enter().append('rect').attr('x', 0).attr('y', 0);
                rect.attr('width', group.innerWidth()).attr('height', group.innerWidth());
                group.setBackground(this, rect);
            }

            function FillCanvas () {
                var ctx = group.context(),
                    width = group.innerWidth(),
                    height = group.innerHeight();
                ctx.beginPath();
                ctx.rect(0, 0, width, height);
                if (isFunction(this.fill))
                    this.fill.x1(0).y1(0).x2(width).y2(height);
                group.setBackground(this);
            }
        }
    });
