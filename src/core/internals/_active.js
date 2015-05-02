    //
    //  Manage active elements in a paper
    function activeEvents (paper) {

        var activeElements = [],
            activeIn = [],
            activeOut = [],
            canvases = [],
            opts = paper.options(),
            index;

        paper.activeOut = function (d) {
            if (!arguments.length) {
                activeElements.forEach(function (a) {
                    paper.activeOut(a);
                });
            } else {
                if (activeOut.indexOf(d) === -1) activeOut.push(d);
                var index = activeIn.indexOf(d);
                if (index > -1) activeIn.splice(index, 1);
            }
            return paper;
        };

        paper.activeIn = function (d) {
            if (activeIn.indexOf(d) === -1) activeIn.push(d);
            var index = activeOut.indexOf(d);
            if (index > -1) activeOut.splice(index, 1);
            return paper;
        };

        // paper task for
        //  * De-activating elements no longer active
        //  * Activating active elements
        paper.task(function () {
            var el;

            // clear canvases managing active events
            canvases.splice(0).forEach(function (ctx) {
                d3.canvas.clear(ctx);
            });

            if (activeOut.length) {
                g.log.debug('deactivating elements');
                activeOut.forEach(function (a) {
                    index = activeElements.indexOf(a);
                    if (index > -1) activeElements.splice(index, 1);
                    if (isCanvas(a))
                        a.reset();
                    else {
                        el = d3.select(a);
                        el.datum().reset().render(el);
                    }
                });
                paper.event('activeout').call(activeOut.splice(0));
            }

            activeIn.forEach(function (a) {
                index = activeElements.indexOf(a);
                if (index === -1) {
                    activeElements.push(a);
                    if (!isCanvas(a)) {
                        el = d3.select(a);
                        el.datum().highLight().render(el);
                    }
                }
            });

            activeElements.forEach(function (a) {
                if (isCanvas(a)) a.highLight().render();
            });

            if (activeIn.splice(0).length)
                paper.event('active').call(activeElements.slice());
        });


        g.constants.pointEvents.forEach(function (event) {

            paper.on(event, function () {
                var el = d3.select(this);
                if (el.size()) {
                    if (this.getContext) activeCanvas(paper, this.getContext('2d'));
                    else activeSvg(paper, el);
                }
            });
        });


        function activeSvg (paper, el) {
            var data = el.datum();
            if (!data || !data.highlighted)
                return paper.activeOut();

            var node = el.node();

            if (d3.event.type === 'mouseout')
                paper.activeOut(node);
            else if (d3.event.type === 'mouseout')
                paper.activeOut(node);
            else
                paper.activeIn(node);
        }

        function activeCanvas (paper, ctx) {
            var point = d3.canvas.mouse(ctx.canvas),
                active = paper.canvasDataAtPoint(point);

            if (canvases.indexOf(ctx) === -1) canvases.push(ctx);

            if (ctx.paperactive)
                ctx.paperactive.forEach(function (a) {
                    if (active.indexOf(a) === -1)
                        paper.activeOut(a);
                });
            ctx.paperactive = active.map(function (a) {
                paper.activeIn(a.context(ctx));
                return a;
            });
        }

        function isCanvas (a) {
            return isFunction(a.context);
        }
    }
