
    g.paper.types.canvas = function (paper, element, cfg) {
        var canvas = element.append("canvas")
                .attr("width", cfg.width)
                .attr("height", cfg.height),
            ctx = canvas.node().getContext('2d'),
            current = ctx;

        cfg.yaxis = 1,
        cfg.xAxis = d3.canvas.axis(),
        cfg.yAxis = [d3.canvas.axis(), d3.canvas.axis()];

        paper.current = function () {
            return current;
        };
    };