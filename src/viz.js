    d3ext.VizDefaults = {
        // milliseconds to delay the resizing of a visualization
        resizeDelay: 200,
        // Option callback after initialisation
        onInit: null,
        // Events dispatched by the visualization
        events: ['build', 'change']
    };
    //
    //  Vizualization Class
    //  -------------------------------
    //
    //  Utility for building visualization using d3
    //  The only method to implement is ``d3build``
    //
    //  ``attrs`` is an object containing optional parameters/callbacks for
    //  the visulaization. For all visualizations the following parameters
    //  are supported
    //
    //  * ``processData``: a function to invoke once data has been loaded
    //  * ``width``: The width of the visualization, if not provided it will be evaluated
    //    from the element of its parent
    //  * ``height``: The height of the visualization, if not provided it will be evaluated
    //    from the element of its parent
    var Viz = d3ext.Viz = Class.extend({
        //
        // Initialise the vizualization with a DOM element and
        //  an object of attributes
        init: function (element, attrs) {
            if (!attrs && Object(element) === element) {
                attrs = element;
                element = null;
            }
            if (!element)
                element = document.createElement('div');
            attrs = extend({}, d3ext.VizDefaults, this.defaults, attrs);
            element = d3.select(element);
            this.element = element;
            this.attrs = attrs;
            this.log = log(attrs.debug);
            this.elwidth = null;
            this.elheight = null;
            this.dispatch = d3.dispatch.apply(d3, attrs.events);

            if (!attrs.width) {
                attrs.width = getWidth(element);
                if (attrs.width)
                    this.elwidth = true;
                else
                    attrs.width = 400;
            }
            if (!attrs.height) {
                attrs.height = getHeight(element);
                if (attrs.height)
                    this.elheight = true;
                else
                    attrs.height = 400;
            }
            else if (typeof(attrs.height) === "string" && attrs.height.indexOf('%') === attrs.height.length-1) {
                attrs.height_percentage = 0.01*parseFloat(attrs.height);
                attrs.height = attrs.height_percentage*attrs.width;
            }
            //
            if (attrs.resize) {
                var self = this;
                if (window.onresize === null) {
                    window.onresize = generateResize();
                }
                if (window.onresize.add) {
                    window.onresize.add(function () {
                        self._resize();
                    });
                }
            }
            //
            if (attrs.onInit)
                attrs.onInit.call(this);
        },
        //
        // Resize the vizualization
        _resize: function () {
            var w = this.elwidth ? getWidth(this.element) : this.attrs.width,
                h;
            if (this.attrs.height_percentage)
                h = w*this.attrs.height_percentage;
            else
                h = this.elheight ? getHeight(this.element) : this.attrs.height;
            if (this.attrs.width !== w || this.attrs.height !== h) {
                this.attrs.width = w;
                this.attrs.height = h;
                if (!this._resizing) {
                    if (this.attrs.resizeDelay) {
                        var self = this;
                        this._resizing = true;
                        setTimeout(function () {
                            self.log.info('Resizing visualization');
                            self.resize();
                            self._resizing = false;
                        }, this.attrs.resizeDelay);
                    } else {
                        this.resize();
                    }
                }
            }
        },
        //
        // Resize the vizualization
        resize: function (size) {
            if (size) {
                this.attrs.width = size[0];
                this.attrs.height = size[1];
            }
            this.build();
        },
        //
        // Return a new d3 svg element insite the element without any children
        svg: function () {
            this.element.html('');
            return this.element.append("svg")
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
            this.d3build();
            if (this.dispatch.build)
                this.dispatch.build(this);
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
            if (src) {
                return d3.json(src, function(error, json) {
                    if (!error) {
                        self.setData(json, callback);
                    }
                });
            }
        },
        //
        // Set new data for the visualization
        setData: function (data, callback) {
            if (this.attrs.processData)
                data = this.attrs.processData(data);
            this.attrs.data = data;
            if (callback)
                callback();
        }
    });

    d3ext.isviz = function (o) {
        return o !== Viz && o.prototype && o.prototype instanceof Viz;
    };

