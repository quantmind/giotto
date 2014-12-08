    var _idCounter = 0;
    //
    // Create a new paper for drawing stuff
    g.paper = function (element, p) {

        var paper = {},
            uid = ++_idCounter,
            color;

        if (isObject(element)) {
            p = element;
            element = null;
        }
        if (!element)
            element = document.createElement('div');

        element = d3.select(element);

        p = _newPaperAttr(element, p);

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
            if (!arguments.length) return p.yaxisNumber;
            if (x === 1 || x === 2)
                p.yaxisNumber = x;
            return paper;
        };

        paper.xAxis = function (x) {
            return p.xAxis;
        };

        paper.yAxis = function () {
            return p.yAxis[p.yaxisNumber-1];
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

        paper.xyData = function (data) {
            if (!data) return;
            if (!data.data) data = {data: data};

            var xy = data.data,
                xmin = Infinity,
                ymin = Infinity,
                xmax =-Infinity,
                ymax =-Infinity,
                x = function (x) {
                    xmin = x < xmin ? x : xmin;
                    xmax = x > xmax ? x : xmax;
                    return x;
                },
                y = function (y) {
                    ymin = y < ymin ? y : ymin;
                    ymax = y > ymax ? y : ymax;
                    return y;
                };
            var xydata = [];
            if (isArray(xy[0]) && xy[0].length === 2) {
                xy.forEach(function (xy) {
                    xydata.push({x: x(xy[0]), y: y(xy[1])});
                });
            } else {
                var xl = data.xlabel || 'x',
                    yl = data.ylabel || 'y';
                xy.forEach(function (xy) {
                    xydata.push({x: x(xy[xl]), y: y(xy[yl])});
                });
            }
            data.data = xydata;
            data.xrange = [xmin, xmax];
            data.yrange = [ymin, ymax];
            return data;
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

        // Auto resize the paper
        if (p.resize) {
            //
            d3.select(window).on('resize.paper', function () {
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
