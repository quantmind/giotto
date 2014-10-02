(function () {
    "use strict";
    var d3ext = {
        version: "0.1.0"
    };

    function noop () {}

    var log = function (debug) {

        function formatError(arg) {
            if (arg instanceof Error) {
                if (arg.stack) {
                    arg = (arg.message && arg.stack.indexOf(arg.message) === -1
                        ) ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
                } else if (arg.sourceURL) {
                    arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
                }
            }
            return arg;
        }

        function consoleLog(type) {
            var console = window.console || {},
                logFn = console[type] || console.log || noop,
                hasApply = false;

              // Note: reading logFn.apply throws an error in IE11 in IE8 document mode.
              // The reason behind this is that console.log has type "object" in IE8...
              try {
                    hasApply = !!logFn.apply;
              } catch (e) {}

              if (hasApply) {
                    return function() {
                        var args = [];
                            forEach(arguments, function(arg) {
                                args.push(formatError(arg));
                        });
                        return logFn.apply(console, args);
                    };
            }

            // we are IE which either doesn't have window.console => this is noop and we do nothing,
            // or we are IE where console.log doesn't have apply so we log at least first 2 args
            return function(arg1, arg2) {
                logFn(arg1, arg2 === null ? '' : arg2);
            };
        }

        return {
            log: consoleLog('log'),
            info: consoleLog('info'),
            warn: consoleLog('warn'),
            error: consoleLog('error'),
            debug: (function () {
                var fn = consoleLog('debug');

                return function() {
                    if (debug) {
                        fn.apply(self, arguments);
                    }
                };
            }()),

        };
    };
    //  Simple extend function
    //
    var extend = d3ext.extend = function () {
        var length = arguments.length,
            object = arguments[0];

        if (!object || length < 2) {
            return object;
        }
        var index = 0,
            obj;

        while (++index < length) {
            obj = arguments[index];
            if (Object(obj) === obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        object[prop] = obj[prop];
                }
            }
        }
        return object;
    };

    var
    //
    // Test for ``_super`` method in a ``Class``.
    //
    // Check http://ejohn.org/blog/simple-javascript-inheritance/
    // for details.
    fnTest = /xyz/.test(function(){var xyz;}) ? /\b_super\b/ : /.*/,
    //
    // Create a method for a derived Class
    create_method = function (type, name, attr, _super) {
        if (typeof attr === "function" && typeof _super[name] === "function" &&
                fnTest.test(attr)) {
            return type.new_attr(name, function() {
                var tmp = this._super;
                // Add a new ._super() method that is the same method
                // but on the super-class
                this._super = _super[name];
                // The method only need to be bound temporarily, so we
                // remove it when we're done executing
                var ret = attr.apply(this, arguments);
                this._super = tmp;
                return ret;
            });
        } else {
            return type.new_attr(name, attr);
        }
    },
    //
    //  Type
    //  -------------

    //  A Type is a factory of Classes. This is the correspondent of
    //  python metaclasses.
    Type = d3ext.Type = (function (t) {

        t.new_class = function (Caller, attrs) {
            var type = this,
                meta = Caller === type,
                _super = meta ? Caller : Caller.prototype;
            // Instantiate a base class
            Caller.initialising = true;
            var prototype = new Caller();
            delete Caller.initialising;
            //
            // Copy the properties over onto the new prototype
            for (var name in attrs) {
                if (name !== 'Metaclass') {
                    prototype[name] = create_method.call(Caller,
                            type, name, attrs[name], _super);
                }
            }
            if (!meta) {
                //
                // The dummy class constructor
                var constructor = function () {
                    // All construction is actually done in the init method
                    if ( !this.constructor.initialising && this.init ) {
                        this.init.apply(this, arguments);
                    }
                };
                //
                // Populate our constructed prototype object
                constructor.prototype = prototype;
                // Enforce the constructor to be what we expect
                constructor.prototype.constructor = constructor;
                // And make this class extendable
                constructor.extend = Caller.extend;
                //
                return constructor;
            } else {
                for (name in _super) {
                    if (prototype[name] === undefined) {
                        prototype[name] = _super[name];
                    }
                }
                return prototype;
            }
        };
        //
        t.new_attr = function (name, attr) {
            return attr;
        };
        // Create a new Class that inherits from this class
        t.extend = function (attrs) {
            return t.new_class(this, attrs);
        };
        //
        return t;
    }(function(){})),
    //
    //  ## Class

    //  Lux base class.
    //  The `extend` method is the most important function of this object.
    Class = d3ext.Class = (function (c) {
        c.__class__ = Type;
        //
        c.extend = function (attrs) {
            var type = attrs.Metaclass || this.__class__;
            var cls = type.new_class(this, attrs);
            cls.__class__ = type;
            return cls;
        };
        //
        return c;
    }(function() {}));


    //
    //  Vizualization Class
    //  -------------------------------
    //
    //  Utility for building visualization using d3
    //  The only method to implement is ``d3build``
    var Viz = d3ext.Viz = Class.extend({
        //
        // Initialise the vizualization with a DOM element, an object of attributes
        // and the (optional) angular $service
        init: function (element, attrs, $service) {
            attrs = extend({}, this.defaults, attrs);
            element = $(element);
            this.element = element;
            this.attrs = attrs;
            this.$service = $service;
            this.log = log(attrs.debug);
            this.elwidth = null;
            this.elheight = null;
            this.d3 = null;

            var parent = this.element.parent();

            if (!attrs.width) {
                attrs.width = element.width();
                if (attrs.width)
                    this.elwidth = element;
                else {
                    attrs.width = parent.width();
                    if (attrs.width)
                        this.elwidth = parent;
                    else
                        attrs.width = 400;
                }
            } else {
                attrs.width = +attrs.width;
            }
            //
            if (!attrs.height) {
                attrs.height = element.height();
                if (attrs.height)
                    this.elheight = element;
                else {
                    attrs.height = parent.height();
                    if (attrs.height)
                        this.elheight = parent;
                    else
                        attrs.height = 400;
                }
            } else if (attrs.height.indexOf('%') === attrs.height.length-1) {
                attrs.height_percentage = 0.01*parseFloat(attrs.height);
                attrs.height = attrs.height_percentage*attrs.width;
            }
            //
            if (attrs.resize) {
                var self = this;
                $(window).resize(function () {
                    self.resize();
                });
            }
        },
        //
        // Resize the vizualization
        resize: function (size) {
            var w, h;
            if (size) {
                w = size[0];
                h = size[1];
            } else {
                w = this.elwidth ? this.elwidth.width() : this.attrs.width;
                if (this.attrs.height_percentage)
                    h = w*this.attrs.height_percentage;
                else
                    h = this.elheight ? this.elheight.height() : this.attrs.height;
            }
            if (this.attrs.width !== w || this.attrs.height !== h) {
                this.attrs.width = w;
                this.attrs.height = h;
                this.build();
            }
        },
        //
        // Return a new d3 svg element insite the element without any children
        svg: function () {
            this.element.empty();
            return this.d3.select(this.element[0]).append("svg")
                .attr("width", this.attrs.width)
                .attr("height", this.attrs.height);
        },

        size: function () {
            return [this.attrs.width, this.attrs.height];
        },
        //
        // Normalized Height
        //
        // Try to always work with non dimensional coordinates,
        // Normalised vi the width
        sy: function () {
            var size = this.size();
            return size[1]/size[0];
        },
        //
        // Build the visualisation
        build: function (options) {
            if (options)
                this.attrs = extend(this.attrs, options);
            //
            if (!this.d3) {
                var self = this;
                require(['d3'], function (d3) {
                    self.d3 = d3;
                    self.d3build();
                });
            } else {
                this.d3build();
            }
        },
        //
        // This is the actual method to implement
        d3build: function () {

        },
        //
        // Load data
        loadData: function (callback) {
            var self = this,
                src = this.attrs.src;
            if (src && this.d3) {
                return this.d3.json(src, function(error, json) {
                    if (!error) {
                        self.attrs.data = json || {};
                        callback();
                    }
                });
            }
        }
    });

    d3ext.isviz = function (o) {
        return o !== Viz && o.prototype && o.prototype instanceof Viz;
    };

    //
    //  Sunburst visualization
    //
    //  In addition to standard Viz parameters:
    //      labels: display labels or not (default false)
    //      padding: padding of sunburst (default 10)
    d3ext.SunBurst = Viz.extend({
        defaults: {
            labels: true,
            padding: 10,
            transition: 750,
            scale: 'sqrt'
        },
        //
        d3build: function () {
            var self = this;
            //
            // Load data if not already available
            if (!this.attrs.data) {
                return this.loadData(function () {
                    self.d3build();
                });
            }
            //
            var d3 = this.d3,
                size = this.size(),
                attrs = this.attrs,
                root = attrs.data,
                padding = +attrs.padding,
                transition = +attrs.transition,
                width = size[0]/2,
                height = size[1]/2,
                radius = Math.min(width, height)-padding,
                // Create the partition layout
                partition = d3.layout.partition()
                    .value(function(d) { return d.size; })
                    .sort(function (d) { return d.order === undefined ? d.size : d.order;}),
                svg = this.svg().append('g')
                          .attr("transform", "translate(" + width + "," + height + ")"),
                g = svg.selectAll("g")
                       .data(partition.nodes(root))
                       .enter().append('g').attr('class', 'sunburst'),
                color = d3.scale.category20c(),
                x = d3.scale.linear().range([0, 2 * Math.PI]),  // angular position
                y = scale(radius),  // radial position
                depth = 0,
                text;

            var arc = d3.svg.arc()
                    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
                    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); }),
                path = g.append("path")
                        .attr("d", arc)
                        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                        .on("click", click);

            if (this.attrs.labels) {
                text = alignText(g.append("text").text(function(d) {
                    if (attrs.addorder !== undefined && d.order !== undefined)
                        return d.order + ' - ' + d.name;
                    else
                        return d.name;
                }));
            }

            function scale (radius) {
                if (attrs.scale === 'log')
                    return d3.scale.log().range([1, radius]);
                if (attrs.scale === 'linear')
                    return d3.scale.linear().range([0, radius]);
                else
                    return d3.scale.sqrt().range([0, radius]);
            }

            function click(d) {
                // Fade out all text elements
                if (depth === d.depth) return;
                if (text) text.transition().attr("opacity", 0);
                depth = d.depth;
                //
                path.transition()
                    .duration(transition)
                    .attrTween("d", arcTween(d))
                    .each('end', function (e, i) {
                        // check if the animated element's data e lies within the visible angle span given in d
                        if (text && e.depth >= depth && (e.x >= d.x && e.x < (d.x + d.dx))) {
                            // fade in the text element and recalculate positions
                            alignText(d3.select(this.parentNode)
                                        .select("text")
                                        .transition().duration(transition)
                                        .attr("opacity", 1));
                        }
                    });
            }

            function angle (d) {
                return x(d.x + d.dx / 2);
            }

            // Align text when labels are displaid
            function alignText(text) {
                return text.attr("x", function(d) {
                    // Set the Radial position
                    if (d.depth === depth)
                        return 0;
                    else {
                        return angle(d) > Math.PI ? -y(d.y) : y(d.y);
                    }
                }).attr("dx", function(d) {
                    // Set the margin
                    return d.depth === depth ? 0 : (angle(d) > Math.PI ? -6 : 6);
                }).attr("dy", function(d) {
                    // Set the Radial position
                    if (d.depth === depth)
                        return d.depth ? 40 : 0;
                    else
                        return ".35em";
                }).attr("transform", function(d) {
                    // Set the Angular position
                    var a = 0;
                    if (d.depth !== depth) {
                        a = angle(d);
                        if (a > Math.PI)
                            a -= Math.PI;
                        a -= Math.PI / 2;
                    }
                    return "rotate(" + (a / Math.PI * 180) + ")";
                }).attr("text-anchor", function (d) {
                    if (d.depth === depth)
                        return "middle";
                    else if (angle(d) > Math.PI)
                        return "end";
                    else
                        return "start";
                }).style("font-size", function(d) {
                    // Set the margin
                    return d.depth === depth ? '120%' : '100%';
                });
            }

            // Interpolate the scales!
            function arcTween(d) {
                var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                    yd = d3.interpolate(y.domain(), [d.y, 1]),
                    yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                return function(d, i) {
                    return i ? function(t) { return arc(d); } : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
                };
            }
        }
    });


    d3ext.C3 = Viz.extend({
        //
        d3build: function () {
            var self = this;
            if (!this.c3) {
                return require(['c3'], function (c3) {
                    self.c3 = c3;
                    self.d3build();
                });
            }
            //
            //
            // Load data if not already available
            if (!this.attrs.data) {
                return this.loadData(function () {
                    self.d3build();
                });
            }
            //
            var series = this.attrs.data;
            if (series.series) series = series.series;
            var options = extend({
                bindto: this.element[0],
                data: {
                    x: series[0][0],
                    columns: series
                }
            }, this.attrs.c3);
            var chart = this.c3.generate(options);
        }
    });

    //
    //
    // Force layout example
    d3ext.Force = Viz.extend({
        //
        d3build: function () {
            var d2 = this.d3,
                svg = this.svg(),
                attrs = this.attrs,
                nNodes = attrs.nodes || 100,
                minRadius = attrs.minRadius || 4,
                maxRadius = attrs.maxRadius || 16,
                gravity = attrs.gravity || 0.05,
                charge = attrs.charge || -2000,
                dr = maxRadius > minRadius ? maxRadius - minRadius : 0,
                nodes = d3.range(nNodes).map(function() { return {radius: Math.random() * dr + minRadius}; }),
                color = d3.scale.category10();

            var force = d3.layout.force()
                .gravity(gravity)
                .charge(function(d, i) {
                    return i ? 0 : charge;
                })
                .nodes(nodes)
                .size(this.size());

            var root = nodes[0];
            root.radius = 0;
            root.fixed = true;

            force.start();

            svg.selectAll("circle")
                .data(nodes.slice(1))
                .enter().append("svg:circle")
                .attr("r", function(d) { return d.radius - 2; })
                .style("fill", function(d, i) { return color(i % 3); });

            force.on("tick", function(e) {
                var q = d3.geom.quadtree(nodes),
                    i = 0,
                    n = nodes.length;

                while (++i < n) {
                    q.visit(collide(nodes[i]));
                }

                svg.selectAll("circle")
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            });

            svg.on("mousemove", function() {
                var p1 = d3.mouse(this);
                root.px = p1[0];
                root.py = p1[1];
                force.resume();
            }).on("touchmove", function() {
                var p1 = d3.touches(this);
                root.px = p1[0];
                root.py = p1[1];
                force.resume();
            });

            function collide (node) {
                var r = node.radius + 16,
                    nx1 = node.x - r,
                    nx2 = node.x + r,
                    ny1 = node.y - r,
                    ny2 = node.y + r;

                return function(quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== node)) {
                        var x = node.x - quad.point.x,
                            y = node.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = node.radius + quad.point.radius;
                        if (l < r) {
                            l = (l - r) / l * 0.5;
                            node.x -= x *= l;
                            node.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                };
            }
        },
        //
        //  handle node charge

    });

    if (typeof define === "function" && define.amd)
        define(d3ext);
    else if (typeof module === "object" && module.exports)
        module.exports = d3ext;
    else
        window.d3ext = d3ext;

}());