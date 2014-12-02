    var _idCounter = 0;
    //
    // Create a new paper for drawing stuff
    g.paper = function (element, p) {

        var paper = {},
            uid = ++_idCounter,
            components,
            componentMap,
            cidCounter,
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
        paper.size = function () {
            return [p.size[0], p.size[1]];
        };

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
        paper.pickColor = function () {
            var c = p.colors[color++];
            if (color === p.colors.length) {
                // TODO: lighetn the colors maybe?
                color = 0;
            }
            return c;
        };

        //
        // Add a new component to the paper and return the component id
        paper.addComponent = function (callback) {
            var cid = ++cidCounter;
            components.push(callback);
            componentMap[cid] = callback;
            callback();
            return cid;
        };

        paper.removeComponent = function (cid) {
            if (!cid) return;
            var callback = componentMap[cid];
            if (callback) {
                delete componentMap[cid];
                var index = components.indexOf(callback);
                if (index > -1)
                    return components.splice(index, 1)[0];
            }
        };

        //  Render the paper by executing all components
        //  If a component id is provided, render only the matching
        //  component
        paper.render = function (cid) {
            if (!arguments.length)
                components.forEach(function (callback) {
                    callback();
                });
            else if (componentMap[cid])
                componentMap[cid]();
        };

        // Clear the paper from all compoents
        // It erases everything
        paper.clear = function () {
            components = [];
            componentMap = {};
            cidCounter = 0;
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
