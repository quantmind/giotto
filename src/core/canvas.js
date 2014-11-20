
    g.paper.types.canvas = function (paper, p) {
        var canvas, ctx, current;

        p.xAxis = d3.canvas.axis();
        p.yAxis = [d3.canvas.axis(), d3.canvas.axis()];

        paper.refresh = function () {
            paper.destroy();
            canvas = paper.element().append("canvas")
                            .attr("width", p.size[0])
                            .attr("height", p.size[1]);
            ctx = canvas.node().getContext('2d');
            current = ctx;
            p.event.refresh({type: 'refresh', size: p.size.slice(0)});
            return paper;
        };

        paper.refresh();

        paper.current = function () {
            return current;
        };

        paper.clear = function () {
            current = ctx;
            current.clearRect(0, 0, p.size[0], p.size[1]);
            return paper;
        };
    };