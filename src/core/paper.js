    var _idCounter = 0;
    //
    // Create a new paper for drawing stuff
    g.paper = function (element, p) {

        var paper = d3.dispatch.apply({}, p.activeEvents),
            uid = ++_idCounter;

        // Create a new group for this paper
        paper.group = function (opts) {
            // Inject plugins
            opts = groupOptions(opts);
            var group = g.group[opts.type](paper, opts),
                plugin;

            group.element().classed(p.giotto, true);
            for (var i=0; i < g.paper.plugins.length; ++i) {
                plugin = g.paper.plugins[i][opts.type];
                if (plugin) plugin(group, opts);
            }
            return group;
        };

        paper.uid = function () {
            return uid;
        };

        // Select a group based on attributes
        paper.select = function (attr) {
            var selection = paper.svg().selectAll('.' + p.giotto),
                node;
            if (attr) selection = selection.filter(attr);
            node = selection.node();
            if (node) return node.__group__;
            selection = paper.canvas().selectAll('.' + p.giotto);
            if (attr) selection = selection.filter(attr);
            node = selection.node();
            if (node) return node.__group__;
        };

        paper.each = function (filter, callback) {
            if (arguments.length === 1) {
                callback = filter;
                filter = '*';
            }
            paper.svg().selectAll(filter).each(function () {
                if (this.__group__)
                    callback(this.__group__);
            });
            paper.canvas().selectAll(filter).each(function () {
                if (this.__group__)
                    callback(this.__group__);
            });
            return paper;
        };

        // Clear everything
        paper.clear = function () {
            paper.svg().remove();
            paper.canvas().remove();
            return paper;
        };

        paper.render = function () {
            var c, i;
            paper.each(function (group) {
                group.render();
            });
            return paper;
        };

        paper.element = function () {
            return d3.select(element);
        };

        paper.classGroup = function (cn, opts) {
            var gg = paper.select('.' + cn);
            if (!gg) {
                gg = paper.group(opts);
                gg.element().classed(cn, true);
            }
            return gg;
        };

        // Resize the paper and fire the resize event if resizing was performed
        paper.resize = function (size) {
            p._resizing = true;
            if (!size) {
                size = paper.boundingBox();
            }
            if (p.size[0] !== size[0] || p.size[1] !== size[1]) {
                g.log.info('Resizing paper');
                paper.each(function (group) {
                    group.resize(size);
                });
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

        // pick a color
        paper.pickColor = function (index, darker) {
            if (arguments.length === 0)
                index = p.colorIndex++;
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

        // Access internal options
        paper.options = function () {
            return p;
        };

        // Create an svg container
        paper.svg = function (build) {
            var svg = paper.element().select('svg.giotto');
            if (!svg.node() && build)
                svg = paper.element().append('svg')
                                .attr('class', 'giotto')
                                .attr('width', p.size[0])
                                .attr('height', p.size[1])
                                .attr("viewBox", "0 0 " + p.size[0] + " " + p.size[1]);
            return svg;
        };

        // Access the canvas container
        paper.canvas = function (build) {
            var canvas = paper.element().select('div.canvas-container');
            if (!canvas.node() && build)
                canvas = paper.element().append('div')
                                .attr('class', 'canvas-container')
                                .style('position', 'relative');
            return canvas;
        };

        paper.canvasDataAtPoint = function (point) {
            var data = [];
            paper.canvas().selectAll('*').each(function () {
                if (this.__group__)
                    this.__group__.dataAtPoint(point, data);
            });
            return data;
        };

        paper.encodeSVG = function () {
            var svg = paper.svg();
            if (svg.node())
                return btoa(unescape(encodeURIComponent(
                    svg.attr("version", "1.1")
                        .attr("xmlns", "http://www.w3.org/2000/svg")
                        .node().parentNode.innerHTML)));
        };

        paper.imageSVG = function () {
            var svg = paper.encodeSVG();
            if (svg)
                return "data:image/svg+xml;charset=utf-8;base64," + svg;
        };

        // Setup

        if (isObject(element)) {
            p = element;
            element = null;
        }
        if (!element)
            element = document.createElement('div');

        p = _newPaperAttr(element, p);

        var type = p.type;

        // paper type
        paper.type = function () {
            return type;
        };
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

        function groupOptions (opts) {
            opts || (opts = {});
            if (!opts.yaxis || opts.yaxis === 1)
                opts.yaxis = p.yaxis;
            else if (opts.yaxis === 2)
                opts.yaxis = p.yaxis2;
            return copyMissing(p, opts);
        }
    };

    g.paper.plugins = [];

    g.paper.plugin = function (name, plugin) {
        g.defaults.paper[name] = plugin.defaults;
        g.paper.plugins.push(plugin);
    };
