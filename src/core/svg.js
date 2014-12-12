    //
    //  SVG Paper
    //  ================
    //
    g.paper.addType('svg', function (paper, p) {
        var svg = paper.element().append('svg')
                        .attr('class', 'giotto')
                        .attr('id', 'giotto-paper-' + paper.uid())
                        .attr('width', p.size[0])
                        .attr('height', p.size[1])
                        .attr("viewBox", "0 0 " + p.size[0] + " " + p.size[1]),
            clear = paper.clear,
            events = d3.dispatch('activein', 'activeout'),
            components,
            componentMap,
            cidCounter,
            current;

        paper.destroy = function () {
            svg = current = null;
            paper.element().selectAll('*').remove();
            return paper;
        };

        paper.refresh = function (size) {
            if (size) {
                p.size = size;
                svg.attr('width', p.size[0])
                   .attr('height', p.size[1]);
            }
            return paper;
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

        paper.clear = function () {
            components = [];
            componentMap = {};
            cidCounter = 0;
            svg.selectAll('*').remove();
            current = svg.append('g')
                        .attr("transform", "translate(" + p.margin.left + "," + p.margin.top + ")")
                        .attr('class', 'paper');
            return clear();
        };

        // return the current svg element
        paper.current = function () {
            return current;
        };

        // set the current element to be the root svg element and returns the paper
        paper.root = function () {
            current = svg.select('g.paper');
            return paper;
        };

        // set the current element to be the parent and returns the paper
        paper.parent = function () {
            var node = current.node().parentNode;
            if (node !== svg.node())
                current = d3.select(node);
            return paper;
        };

        paper.on = function (event, callback) {
            if (events[event])
                events.on(event, function (elem) {
                    callback.call(elem, this);
                });
            else
                current.on(event, function (e) {
                    callback.call(this, e);
                });
            return paper;
        };

        paper.data = function (el) {
            return _.isFunction(el.data) ? el.data() : el.__data__;
        };

        paper.group = function (attr) {
            current = current.append('g');
            if (attr)
                current.attr(attr);
            return current;
        };

        paper.circle = function (cx, cy, r) {
            cx = paper.scalex(cx);
            cy = paper.scaley(cy);
            r = paper.scale(r);
            return current.append('circle')
                            .attr('cx', cx)
                            .attr('cy', cy)
                            .attr('r', r);
        };

        paper.rect = function (x, y, width, height, r) {
            var X = paper.scalex(x),
                Y = paper.scaley(y);
            width = paper.scalex(x+width) - X;
            height = paper.scalex(y+height) - Y;
            var rect = current.append('rect')
                                .attr('x', X)
                                .attr('y', Y)
                                .attr('width', width)
                                .attr('height', height);
            if (r) {
                var rx = paper.scalex(r) - paper.scalex(0),
                    ry = paper.scaley(r) - paper.scaley(0);
                rect.attr('rx', rx).attr('ry', rt);
            }
            return rect;
        };

        // Draw a path or an area, data must be an xy array [[x1,y1], [x2, y2], ...]
        paper.path = function (data, opts) {
            opts || (opts = {});
            data = data.slice();  // copy
            chartColors(paper, copyMissing(p.line, opts));

            var container = current,
                scalex = paper.scalex,
                scaley = paper.scaley,
                dline = paperData(paper, opts, {}).reset();

            data.paper = dline;

            dline.draw = function (selection) {
                return selection
                    .attr('stroke', dline.color)
                    .attr('stroke-opacity', dline.colorOpacity)
                    .attr('stroke-width', dline.lineWidth);
            };

            return paper.addComponent(dline, function () {

                var chart = container.select("path.line"),
                    line = opts.area ? d3.svg.area() : d3.svg.line();

                line.interpolate(opts.interpolate)
                    .x(function(d) {return scalex(d.x);})
                    .y(function(d) {return scaley(d.y);});

                if (!chart.node())
                    chart = container.append('path')
                                        .attr('class', 'line');

                dline.draw(chart
                            .classed('area', opts.area)
                            .datum(data)
                            .attr('d', line));

                _events(chart);
            });
        };

        // Draw points
        // Data is an array of {x: value, y: value} objects
        paper.points = function (data, opts) {
            opts || (opts = {});
            data = data.slice();  // copy
            chartColors(paper, copyMissing(p.point, opts));

            var size = paper.scale(paper.dim(opts.size)),
                scalex = paper.scalex,
                scaley = paper.scaley,
                symbol = d3.svg.symbol().type(function (d) {return d.symbol;})
                                        .size(function (d) {return d.size();}),
                container = current,
                d;

            function draw (selection) {
                return _draw(selection).attr('d', symbol);
            }

            for (var i=0; i<data.length; i++) {
                d = paperData(paper, opts, {values: data[i]});
                d.set('size', size);
                d.draw = draw;
                data[i] = d.reset();
            }

            return paper.addComponent(data, function () {
                var chart = container.select("g.points");

                if (!chart.node())
                    chart = container.append("g")
                                    .attr('class', 'points');

                chart.selectAll("path.point").remove();

                _events(draw(chart.selectAll("path.point")
                                .data(data)
                                .enter()
                                .append("path")
                                .attr('class', 'point')
                                .attr("transform", function(d) {
                                    return "translate(" + scalex(d.values.x) + "," + scaley(d.values.y) + ")";
                                })));
            });
        };

        // Draw a barchart
        paper.barchart = function (data, opts) {
            opts || (opts = {});
            data = data.slice();  // copy
            chartColors(paper, copyMissing(p.bar, opts));

            var size = barWidth(paper, data, opts),
                scalex = paper.scalex,
                scaley = paper.scaley,
                container = current,
                d;

            function draw (selection) {
                return _draw(selection).attr("width", function (d) {return d.size();});
            }

            for (var i=0; i<data.length; i++) {
                d = paperData(paper, opts, {values: data[i]});
                d.set('size', size);
                d.draw = draw;
                data[i] = d.reset();
            }

            return paper.addComponent(data, function () {

                var zero = scaley(0),
                    chart = container.select('g.barchart'),
                    bar;

                if (!chart.node())
                    chart = container.append("g")
                                .attr('class', 'barchart');

                bar = draw(chart
                        .selectAll(".bar")
                        .data(data)
                        .enter().append("rect")
                        .attr('class', 'bar')
                        .attr("x", function(d) {
                            return scalex(d.values.x) - 0.5*d.size();
                        })
                        .attr("y", function(d) {return d.values.y < 0 ? zero : scaley(d.values.y); })
                        .attr("height", function(d) {
                            return d.values.y < 0 ? scaley(d.values.y) - zero : zero - scaley(d.values.y);
                        }));

                if (opts.radius > 0)
                    bar.attr('rx', opts.radius).attr('ry', opts.radius);

                _events(bar);
            });
        };

        paper.pie = function (data, opts) {
            opts || (opts = {});
            data = data.slice();  // copy
            copyMissing(p.pie, opts);
            var container = current,
                d, dd;

            for (var i=0; i<data.length; i++) {
                d = pieData(paper, opts, data[i]);
                d.draw = _draw;
                data[i] = d.reset();
            }

            return paper.addComponent(data, function () {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    width = paper.innerWidth(),
                    height = paper.innerHeight(),
                    radius = 0.5*Math.min(width, height),
                    innerRadius = opts.innerRadius*radius,
                    cornerRadius = paper.scale(paper.dim(opts.cornerRadius)),
                    chart = container.select('g.pie'),
                    pie = d3.layout.pie()
                                    .value(function (d, i) {return d.value;})
                                    .padAngle(d3_radians*opts.padAngle)(data),
                    arc = d3.svg.arc()
                            .cornerRadius(cornerRadius)
                            .innerRadius(innerRadius)
                            .outerRadius(radius),
                    c;

                for (i=0; i<pie.length; i++) {
                    d = pie[i];
                    dd = d.data;
                    delete d.data;
                    extend(dd, d);
                    dd.draw = _draw;
                    pie[i] = dd;
                }

                if (!chart.node())
                    chart = container.append("g")
                                .attr('class', 'pie')
                                .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

                chart.selectAll(".slice").remove();

                _events(_draw(chart
                        .selectAll(".slice")
                        .data(pie)
                        .enter().append("path")
                        .attr('class', 'slice')
                        .attr('d', arc)));
            });
        };

        paper.setBackground = function (o, background) {
            if (_.isObject(background)) {
                if (background.opacity !== undefined)
                    o.attr('fill-opacity', background.opacity);
                background = background.color;
            }
            if (_.isString(background))
                o.attr('fill', background);

            return paper;
        };

        // Create a gradient element to use by scg elements
        paper.gradient = function (id, color1, color2) {
            var svg = d3.select("body").append("svg"),
                gradient = svg.append('linearGradient')
                            .attr("x1", "0%")
                            .attr("x2", "100%")
                            .attr("y1", "0%")
                            .attr("y2", "100%")
                            .attr("id", id)
                            .attr("gradientUnits", "userSpaceOnUse");
            gradient
                .append("stop")
                .attr("offset", "0")
                .attr("stop-color", color1);

            gradient
                .append("stop")
                .attr("offset", "0.5")
                .attr("stop-color", color2);
        };

        paper.encode = function () {
            return btoa(unescape(encodeURIComponent(
                svg.attr("version", "1.1")
                    .attr("xmlns", "http://www.w3.org/2000/svg")
                    .node().parentNode.innerHTML)));
        };

        paper.image = function () {
            return "data:image/svg+xml;charset=utf-8;base64," + paper.encode();
        };

        paper.downloadSVG = function (e) {
            var data = paper.image(),
                target = e ? e.target : document;
            d3.select(target).attr("href", data);
        };

        paper.download = paper.downloadSVG;

        // LOW LEVEL FUNCTIONS - MAYBE THEY SHOULD BE PRIVATE?

        // Add a new component to the paper and return the component id
        paper.addComponent = function (component, callback) {
            component = paperComponent(component, callback);
            var cid = ++cidCounter;
            components.push(component);
            componentMap[cid] = component;
            component.cid = cid;
            return component;
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

        // PRIVATE FUNCTIONS

        p._axis = function (axis, cn, px, py, opts) {
            var g = paper.root().current().select('g.' + cn);
            if (!g.node()) {
                g = paper.current().append('g')
                        .attr("class", "axis " + cn);
                paper.addComponent(paperData(paper, opts, axis), function () {
                    var x = px ? px() : 0,
                        y = py ? py() : 0;
                    g.attr("transform", "translate(" + x + "," + y + ")").call(axis);
                    g.selectAll('line, path')
                     .attr('stroke', opts.color)
                     .attr('stroke-width', opts.lineWidth);
                    _font(g.selectAll('text'), opts);
                });
            }
        };

        function _font (selection, opts) {
            return selection.style({
                'fill': opts.color,
                'font-size': opts.size ,
                'font-weight': opts.weight,
                'font-style': opts.style,
                'font-family': opts.family,
                'font-variant': opts.variant
            });
        }

        function _draw (selection) {
            return selection
                    .attr('stroke', function (d) {return d.color;})
                    .attr('stroke-width', function (d) {return d.lineWidth;})
                    .attr('fill', function (d) {return d.fill;})
                    .attr('fill-opacity', function (d) {return d.fillOpacity;});
        }

        function _events (selection) {
            p.activeEvents.forEach(function (event) {
                selection.on(event + '.paper-active', function () {
                    if (d3.event.type === 'mouseout')
                        events.activeout(this);
                    else
                        events.activein(this);
                });
            });
            return selection;
        }
    });
