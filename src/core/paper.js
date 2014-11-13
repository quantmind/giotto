
    g.paper = function (element, cfg) {
        var paper = {},
            p = extend({}, cfg, g.paperDefaults);

        g.paper.types[p.type](paper, element, p);

        paper.type = function () {
            return p.type;
        };

        paper.element = function () {
            return element;
        };

        paper.yaxis = function (x) {
            if (!arguments.length) return p.yaxis;
            if (x === 1 || x === 2)
                p.yaxis = x;
            return paper;
        };

        paper.xAxis = function (x) {
            if (!arguments.length) return p.xAxis;
            p.xAxis = x;
            return paper;
        };

        paper.yAxis = function (x) {
            if (!arguments.length) return p.yAxis[p.yaxis-1];
            p.yAxis[p.yaxis-1] = x;
            return paper;
        };

        paper.scalex = function (x) {
            return p.xAxis.scale(x);
        };

        paper.scaley = function (y) {
            return paper.yAxis().scale(y);
        };

        paper.resize = function (size) {
            p._resizing = true;
            if (!size) {
                size = paper.boundingBox();
            }
            if (p.size[0] !== size[0] || p.size[1] !== size[1]) {
                g.log.info('Resizing paper');
                p.size = size;
                paper.refresh();
            }
            p._resizing = false;
        };

        paper.boundingBox = function () {
            var w = p.elwidth ? getWidth(p.elwidth) : p.width,
                h;
            if (p.height_percentage)
                h = w*p.height_percentage;
            else
                h = p.elheight ? getHeight(p.elheight) : p.height;
            return [w, h];
        };

        // Auto resize the paper
        if (cfg.resize) {
            //
            d3.select(window).on('resize', function () {
                if (!p._resizing) {
                    if (p.resizeDelay) {
                        p._resizing = true;
                        d3.timer(function () {
                            paper.resize();
                            return true;
                        }, p.resizeDelay);
                    } else {
                        this.resize();
                    }
                }
            });
        }
    };


    g.paper.types = {};


    var

    xyData = function (data) {
        if (!isArray(data)) return;
        if (isArray(data[0]) && data[0].length === 2) {
            var xydata = [];
            data.forEach(function (xy) {
                xydata.push({x: xy[0], y: xy[1]});
            });
            return xydata;
        }
        return data;
    };
