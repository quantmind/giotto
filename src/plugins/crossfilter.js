    //
    //  Add brush functionality to svg paper
    g.paper.svg.plugin('brush', {
        axis: 'x'
    },

    function (paper, opts) {
        var cid, brush;

        // Add a brush to the chart if not already available
        paper.addBrush = function () {
            if (cid) return brush;
            brush = d3.svg.brush()
                            .on("brushstart", brushstart)
                            .on("brush", brushmove)
                            .on("brushend", brushend);

            cid = paper.addComponent(function () {
                if (!brush) return;

                var current = paper.root().current(),
                    gBrush = current.select('g.brush'),
                    scale = opts.brush.axis === 'y' ? paper.yAxis().scale() : paper.xAxis().scale();

                if (!gBrush.node())
                    gBrush = current.append('g').attr("class", "brush");

                brush.scale(scale);
                gBrush.call(brush);
            });

            return brush;
        };

        paper.removeBrush = function () {
            cid = paper.removeComponent(cid);
            paper.root().current().select('g.brush').remove();
            brush = null;
        };

    });


    //
    //  Add crossfilter functionality to charts
    g.viz.chart.plugin(function (chart, opts) {
        var dimension,
            brush;

        chart.dimension = function (x) {
            init();
            if (!arguments.length) return dimension;
            dimension = x;
            return chart;
        };

    });