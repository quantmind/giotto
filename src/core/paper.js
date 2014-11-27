    //
    // Create a new paper for drawing stuff
    g.paper = function (element, p) {

        var paper = {};

        if (isObject(element)) {
            p = element;
            element = null;
        }
        if (!element)
            element = document.createElement('div');

        element = d3.select(element);

        p = _newPaperAttr(element, p);

        paper.destroy = function () {
            element.selectAll('*').remove();
            return paper;
        };

        paper.type = function () {
            return p.type;
        };

        paper.size = function () {
            return [p.size[0], p.size[1]];
        };

        paper.width = function () {
            return p.size[0];
        };

        paper.height = function () {
            return p.size[1];
        };

        paper.aspectRatio = function () {
            return p.size[1]/p.size[0];
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

        paper.scale = function (r) {
            var s = p.xAxis.scale();
            return s(r) - s(0);
        };

        paper.scalex = function (x) {
            return p.xAxis.scale()(x);
        };

        paper.scaley = function (y) {
            return paper.yAxis().scale()(y);
        };

        // Resize the paper and fire the resize event if resizing was performed
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
            var w = p.elwidth ? getWidth(p.elwidth) : p.size[0],
                h;
            if (p.height_percentage)
                h = d3.round(w*p.height_percentage, 0);
            else
                h = p.elheight ? getHeight(p.elheight) : p.size[1];
            return [w, h];
        };

        // Auto resize the paper
        if (p.resize) {
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
                        paper.resize();
                    }
                }
            });
        }

        return _initPaper(paper, p);
    };


    g.paper.types = {};


    function xyData (data) {
        if (!isArray(data)) return;
        if (isArray(data[0]) && data[0].length === 2) {
            var xydata = [];
            data.forEach(function (xy) {
                xydata.push({x: xy[0], y: xy[1]});
            });
            return xydata;
        }
        return data;
    }
