    var _idCounter = 0;
    //
    // Create a new paper for drawing stuff
    g.paper = function (element, p) {

        var paper = {},
            uid = ++_idCounter,
            yaxis,
            color;

        // paper type
        paper.type = function () {
            return p.type;
        };

        paper.uid = function () {
            return uid;
        };

        // paper size, [width, height] in pixels
        paper.width = function () {
            return p.size[0];
        };

        paper.height = function () {
            return p.size[1];
        };

        paper.innerWidth = function () {
            return p.size[0] - p.margin.left - p.margin.right;
        };

        paper.innerHeight = function () {
            return p.size[1] - p.margin.top - p.margin.bottom;
        };

        paper.size = function () {
            return [paper.width(), paper.height()];
        };

        paper.aspectRatio = function () {
            return paper.innerHeight()/paper.innerWidth();
        };

        paper.element = function () {
            return element;
        };

        // returns the number of the y-axis currently selected
        paper.yaxis = function (x) {
            if (!arguments.length) return yaxis;
            if (+x === 1 || +x === 2)
                yaxis = +x;
            return paper;
        };

        paper.xAxis = function (x) {
            return p.xAxis;
        };

        paper.yAxis = function () {
            return p.yAxis[yaxis-1];
        };

        paper.allAxis = function () {
            var width = paper.innerWidth(),
                height = paper.innerHeight(),
                yaxis = paper.yaxis(),
                all = [{axis: paper.xAxis(), o: p.xaxis, range: [0, width]},
                       {axis: paper.yaxis(1).yAxis(), o: p.yaxis, range: [height, 0]},
                       {axis: paper.yaxis(2).yAxis(), o: p.yaxis2, range: [height, 0]}];
            paper.yaxis(yaxis);
            return all;
        };

        paper.scale = function (r) {
            var s = p.xAxis.scale();
            return Math.max(0, s(r) - s(0));
        };

        paper.scalex = function (x) {
            return p.xAxis.scale()(x);
        };

        paper.scaley = function (y) {
            return paper.yAxis().scale()(y);
        };

        paper.xfromPX = function (px) {
            return p.xAxis.scale().invert(px);
        };

        paper.yfromPX = function (px) {
            return paper.yAxis().scale().invert(px);
        };

        // Resize the paper and fire the resize event if resizing was performed
        paper.resize = function (size) {
            p._resizing = true;
            if (!size) {
                size = paper.boundingBox();
            }
            if (p.size[0] !== size[0] || p.size[1] !== size[1]) {
                g.log.info('Resizing paper');
                paper.refresh(size);
            }
            p._resizing = false;
        };

        // dimension in the input domain from a 0 <= x <= 1
        // assume a continuous domain
        // TODO allow for multiple domain points
        paper.dim = function (x) {
            var v = +x;
            // assume input is in pixels
            if (isNaN(v))
                return paper.xfromPX(x.substring(0, x.length-2));
            // otherwise assume it is a value between 0 and 1 defined as percentage of the x axis length
            else {
                var d = paper.xAxis().scale().domain();
                return v*(d[d.length-1] - d[0]);
            }
        };

        // x coordinate in the input domain
        paper.x = function (u) {
            var d = paper.xAxis().scale().domain();
            return u*(d[d.length-1] - d[0]) + d[0];
        };

        // y coordinate in the input domain
        paper.y = function (u) {
            var d = paper.yAxis().scale().domain();
            return u*(d[d.length-1] - d[0]) + d[0];
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

        // pick a unique color, never picked before
        paper.pickColor = function (index, darker) {
            if (arguments.length === 0) index = color++;
            var dk = 1,
                k = 0;
            while (index >= p.colors.length) {
                index -= p.colors.length;
                k += dk;
            }
            var c = p.colors[index];
            if (darker)
                c = d3.rgb(c).darker(darker);
            if (k)
                c = d3.rgb(c).brighter(k);
            return c;
        };

        paper.clear = function () {
            color = 0;
            return paper;
        };

        // Access internal options
        paper.options = function () {
            return p;
        };

        paper.drawXaxis = function () {
            var opts = p.xaxis,
                py = opts.position === 'top' ? 0 : paper.innerHeight;
            return p._axis(paper.xAxis(), 'x-axis', 0, py, opts);
        };

        paper.drawYaxis = function () {
            var yaxis = paper.yaxis(),
                opts = yaxis === 1 ? p.yaxis : p.yaxis2,
                px = opts.position === 'left' ? 0 : paper.innerWidth;
            return p._axis(paper.yAxis(), 'y-axis-' + yaxis, px, 0, opts);
        };

        paper.resetAxis = function () {
            paper.yaxis(1).allAxis().forEach(function (a) {
                var axis = a.axis,
                    o = a.o,
                    innerTickSize = paper.scale(paper.dim(o.tickSize)),
                    outerTickSize = paper.scale(paper.dim(o.outerTickSize)),
                    tickPadding = paper.scale(paper.dim(o.tickPadding));
                a.axis.scale().range(a.range);
                a.axis.tickSize(innerTickSize, outerTickSize)
                      .tickPadding(tickPadding)
                      .orient(o.position);

                if (isNull(o.min) || isNull(o.max))
                    o.auto = true;
            });
            return paper;
        };

        // Setup

        if (isObject(element)) {
            p = element;
            element = null;
        }
        if (!element)
            element = document.createElement('div');

        element = d3.select(element);

        p = _newPaperAttr(element, p);
        //
        // Apply paper type
        g.paper[p.type](paper, p);

        // clear the paper
        paper.clear().resetAxis();
        //
        if (p.css)
            addCss('#giotto-paper-' + paper.uid(), p.css);

        // Auto resize the paper
        if (p.resize) {
            //
            d3.select(window).on('resize.paper' + paper.uid(), function () {
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
        //
        return paper;
    };

    //
    //  Paper can be svg or canvas
    //  This function create a paper type with support for plugins
    g.paper.addType = function (type, constructor) {
        var plugins = [];

        g.paper[type] = function (paper, opts) {
            constructor(paper, opts);

            // Inject plugins
            for (var i=0; i < plugins.length; ++i)
                plugins[i](paper, opts);

            return paper;
        };

        g.paper[type].plugin = function (name, defaults, plugin) {
            g.defaults.paper[name] = defaults;
            plugins.push(plugin);
        };

    };


    g.paper.addType('html', function (paper, p) {
        clear = paper.clear;

        paper.clear = function () {
            paper.element().selectAll('*').remove();
            return clear();
        };

    });
