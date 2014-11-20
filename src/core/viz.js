
    g.vizRegistry = (function () {
        var _vizMap = {};

        function initializeVizGroup(group) {
            if (!group) {
                group = g.constants.DEFAULT_VIZ_GROUP;
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

    g.registerViz = function (viz, group) {
        g.vizRegistry.register(viz, group);
    };

    g.deregisterViz = function (viz, group) {
        g.vizRegistry.deregister(viz, group);
    };

    g.hasViz = function (viz) {
        return g.vizRegistry.has(viz);
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
    var Viz = g.Viz = Class.extend({
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
            attrs = extend({}, g.defaults.viz, g.defaults.paper, this.defaults, attrs);
            element = d3.select(element);
            this.element = element;
            this.log = log(attrs.debug);
            this.uid = ++_idCounter;
            this.dispatch = d3.dispatch.apply(d3, attrs.events);
            this.g = g;
            this.attrs = this.getAttributes(attrs);
            //
            if (attrs.onInit)
                this._executeCallback(attrs.onInit);
            if (attrs.autoBuild)
                this.build();
        },
        //
        // Resize the vizualization
        resize: function (size) {
            if (this._paper)
                this._paper.resize(size);
        },
        //
        //  Retrieve the paper when the visualization is displayed
        //  Create a new one if not available
        paper: function (createNew) {
            if (createNew || this._paper === undefined) {
                var self = this;

                if (this._paper)
                    this._paper.destroy();

                this._paper = g.paper(this.element.node(), this.attrs);
                this._paper.on('refresh', function () {
                    self._refresh();
                });
            }
            return this._paper;
        },
        //
        // Build the visualisation
        build: function (options) {
            if (options)
                this.attrs = extend(this.attrs, options);
            this.d3build();
            this.dispatch.build(this);
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
        },
        //
        // Use this method to do something when a refresh event occurs
        _refresh: function () {
            if (this.paper().type() === 'canvas')
                this.build();
        }
    });

    g.isviz = function (o) {
        return o !== Viz && o.prototype && o.prototype instanceof Viz;
    };

