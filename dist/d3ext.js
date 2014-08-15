(function () {
    "use strict";
    var d3ext = {version: "0.1.0"};

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
        // and the (optional) $lux service
        init: function (element, attrs, $lux) {
            element = $(element);
            this.element = element;
            this.attrs = attrs || (attrs = {});
            this.$lux = $lux;
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
            //
            this.build();
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
                this.attrs = $.extend(this.attrs, options);
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

        }
    });

    //  Factory of Angular JS directives for a Viz class
    d3ext.vizDirectiveFactory = function (VizClass) {
        return [function () {
            return {
                //
                // Create via element tag or attribute
                restrict: 'AE',
                //
                link: function (scope, element, attrs) {
                    new VizClass(element, attrs);
                }
            };
        }];
    };


    d3ext.SunBurst = Viz.extend({
        //
        d3build: function () {
            //
            // Load data if not already available
            if (!this.root) {
                var self = this;
                return d3.json(this.attrs.target, function(error, root) {
                    if (!error) {
                        self.root = root || {};
                        self.d3build();
                    }
                });
            }
            //
            var d3 = this.d3,
                size = this.size(),
                root = this.root,
                width = size[0],
                height = size[1],
                svg = this.svg().append("g")
                          .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");
                color = d3.scale.category20c(),
                partition = d3.layout.partition()
                    .value(function(d) { return d.size; });

            var arc = d3.svg.arc()
                    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
                    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); }),
                path = svg.selectAll("path")
                          .data(partition.nodes(root))
                          .enter().append("path")
                          .attr("d", arc)
                          .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                          .on("click", click);

            function click(d) {
                path.transition()
                    .duration(750)
                    .attrTween("d", arcTween(d));
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


    if (typeof define === "function" && define.amd)
        define(d3ext);
    else if (typeof module === "object" && module.exports)
        module.exports = d3ext;
    else
        window.d3ext = d3ext;

}());