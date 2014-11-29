    //
    //  Add grid and zoom functionality to svg paper
    g.paper.svg.plugin('zoom', {
        x: true,
        y: true,
        extent: [1, 10]
    },

    function (paper, opts) {
        var zoom;

        paper.zoom = function (options) {
            if (options)
                extend(opts.zoom, options);
            if (!zoom)
                zoom = d3.behavior.zoom();
            if (opts.zoom.x)
                zoom.x(paper.xAxis().scale());
            if (opts.zoom.y)
                zoom.y(paper.yAxis().scale());
            zoom.scaleExtend(opts.zoom.extent).on('zoom', zoomed);
        };

        // PRIVATE FUNCTIONS

        function zoomed () {
            paper.drawXaxis();
            paper.drawYaxis();
        }
    });
