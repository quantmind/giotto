    x.VizDefaults = {
        //
        // Default paper type
        paper: 'svg',
        // Add resizing on window resize
        resize: false,
        // milliseconds to delay the resizing of a visualization
        resizeDelay: 200,
        // Option callback after initialisation
        onInit: null,
        //
        autoBuild: true,
        // Events dispatched by the visualization
        events: ['build', 'change'],
        //
        // Default parameters when drawing lines
        lines: {
            interpolate: 'basis'
        }
    };

    x.paperDefaults = {
        width: 500,
        height: 400
    };

    x.constants = {
        DEFAULT_VIZ_GROUP: 'default_viz_group'
    };

    x.vizRegistry = (function () {
        var _vizMap = {};

        function initializeVizGroup(group) {
            if (!group) {
                group = x.constants.DEFAULT_VIZ_GROUP;
            }

            if (!_vizMap[group]) {
                _vizMap[group] = [];
            }

            return group;
        }

        return {
            has: function (viz) {
                for (var e in _vizMap) {
                    if (_vizMap[e].indexOf(viz) >= 0) {
                        return true;
                    }
                }
                return false;
            },

            register: function (viz, group) {
                group = initializeVizGroup(group);
                _vizMap[group].push(viz);
            },

            deregister: function (viz, group) {
                group = initializeVizGroup(group);
                for (var i = 0; i < _vizMap[group].length; i++) {
                    if (_vizMap[group][i].anchorName() === viz.anchorName()) {
                        _vizMap[group].splice(i, 1);
                        break;
                    }
                }
            },

            clear: function (group) {
                if (group) {
                    delete _vizMap[group];
                } else {
                    _vizMap = {};
                }
            },

            list: function (group) {
                group = initializeVisGroup(group);
                return _vizMap[group];
            }
        };
    }());

    x.registerViz = function (viz, group) {
        x.vizRegistry.register(viz, group);
    };

    x.deregisterViz = function (viz, group) {
        x.vizRegistry.deregister(viz, group);
    };

    x.hasViz = function (viz) {
        return x.vizRegistry.has(viz);
    };

    var _idCounter = 0;
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
            this.log = log(attrs.debug);
            this.elwidth = null;
            this.elheight = null;
            this.uid = ++_idCounter;
            this.dispatch = d3.dispatch.apply(d3, attrs.events);
            this.d3 = d3;

            if (!attrs.width) {
                attrs.width = getWidth(element);
                if (attrs.width)
                    this.elwidth = getWidthElement(element);
                else
                    attrs.width = 400;
            }
            if (!attrs.height) {
                attrs.height = getHeight(element);
                if (attrs.height)
                    this.elheight = getHeightElement(element);
                else
                    attrs.height = 400;
            }
            else if (typeof(attrs.height) === "string" && attrs.height.indexOf('%') === attrs.height.length-1) {
                attrs.height_percentage = 0.01*parseFloat(attrs.height);
                attrs.height = attrs.height_percentage*attrs.width;
            }
            this.attrs = this.getAttributes(attrs);
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
                this._executeCallback(attrs.onInit);
            if (attrs.autoBuild)
                this.build();
        },
        //
        // Resize the vizualization
        _resize: function () {
            var w = this.elwidth ? getWidth(this.elwidth) : this.attrs.width,
                h;
            if (this.attrs.height_percentage)
                h = w*this.attrs.height_percentage;
            else
                h = this.elheight ? getHeight(this.elheight) : this.attrs.height;
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
        //  Retrieve the paper when the visualization is displayed
        //  Create a new one if not available
        paper: function () {
            if (this._paper === undefined) {
                if (this.attrs.paper === 'canvas')
                    this._paper = new Canvas(this.element, this.attrs);
                else
                    this._paper = new Svg(this.element, this.attrs);
            }
            return this._paper;
        },
        //
        // Return a new d3 svg element insite the element without any children
        svg: function () {
            this.element.html('');
            return this.element.append("svg")
                .attr("width", this.attrs.width)
                .attr("height", this.attrs.height);
        },
        //
        // Return a new canvs element insite the element without any children
        canvas: function () {
            this.element.html('');
            return this.element.append("canvas")
                .attr("width", this.attrs.width)
                .attr("height", this.attrs.height)
                .node().getContext('2d');
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
            this.fire('build');
        },
        //
        // Same as build
        redraw: function (options) {
            this.build(options);
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
        getAttributes: function (attrs) {
            return attrs;
        },
        //
        // Set new data for the visualization
        setData: function (data, callback) {
            if (this.attrs.processData)
                data = this.attrs.processData(data);
            if (Object(data) === data && data.data)
                this.attrs = extend(this.attrs, data);
            else
                this.attrs.data = data;
            if (callback)
                callback();
        },
        //
        // Shortcut for this.dispatch.on(...) but chainable
        on: function (event, callback) {
            this.dispatch.on(event, callback);
            return this;
        },
        //
        // Fire an event if it exists
        fire: function (event) {
            if (this.dispatch[event])
                this.dispatch[event].call(this);
        },
        //
        // Execute a callback
        _executeCallback: function (callback) {
            var cbk = callback;
            if (typeof(callback) === 'string') {
                var obj = root,
                    bits= callback.split('.');

                for (var i=0; i<bits.length; ++i) {
                    obj = obj[bits[i]];
                    if (!obj) break;
                }
                cbk = obj;
            }
            if (typeof(cbk) === 'function')
                cbk.call(this);
            else
                this.log.error('Cannot execute callback "' + callback + '". Not a function');
        }
    });

    d3ext.isviz = function (o) {
        return o !== Viz && o.prototype && o.prototype instanceof Viz;
    };

