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
            attrs = extend({}, this.defaults, attrs);
            element = $(element);
            this.element = element;
            this.attrs = attrs;
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

    //  Factory of Angular JS directives for a Viz class
    d3ext.vizDirectiveFactory = function (VizClass) {
        return [function () {
            return {
                //
                // Create via element tag or attribute
                restrict: 'AE',
                //
                link: function (scope, element, attrs) {
                    var v = new VizClass(element, attrs);
                    v.build();
                }
            };
        }];
    };
