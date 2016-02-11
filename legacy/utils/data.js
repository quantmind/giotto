    /** @module data */

    // Convert an array of array obtained from reading a CSV file into an array of objects
    g.data.fromcsv = function (data) {
        var labels = data[0],
            rows = [],
            o, j;
        for (var i=1; i<data.length; ++i) {
            o = {};
            for (j=0; j<labels.length; ++j)
                o[labels[j]] = data[i][j];
            rows.push(o);
        }
        return rows;
    };

    //  Giotto serie
    //  =================
    //
    //  A serie is an abstraction on top of an array.
    //  It provides accessor functions and several utilities for
    //  understanding and manipulating the underlying data which is either
    //  an array or another serie.
    g.data.serie = function () {
        var serie = {},
            x = d3_geom_pointX,
            y = d3_geom_pointY,
            data,
            label;

        serie.x = function (_) {
            if (!arguments.length) return x;
            if (!isFunction(_)) _ = label_functor(_);
            x = _;
            return serie;
        };

        serie.y = function (_) {
            if (!arguments.length) return y;
            if (!isFunction(_)) _ = label_functor(_);
            y = _;
            return serie;
        };

        serie.label = function (_) {
            if (!arguments.length) return label;
            if (_ && !isFunction(_)) _ = label_functor(_);
            label = _;
            return serie;
        };

        //  Set/get data associated with this serie
        serie.data = function (_) {
            if (!arguments.length) return data;
            data = _;
            return serie;
        };

        serie.forEach = function (callback) {
            if (data)
                data.forEach(callback);
            return serie;
        };

        serie.map = function (callback) {
            if (data)
                return data.map(callback);
        };

        //  Get a value at key
        //  the data must implement the get function
        serie.get = function (key) {
            if (data && isFunction(data.get))
                return data.get(key);
        };

        serie.xrange = function () {
            return getRange(x);
        };

        serie.yrange = function () {
            return getRange(y);
        };

        Object.defineProperty(serie, 'length', {
            get: function () {
                return data ? data.length : 0;
            }
        });

        return serie;

        //  Get a valid range for this timeserie if possible
        //  If a valid range is available is return as an array [min, max]
        //  otherwise nothing is returned
        function getRange (accessor) {
            var vmin = Infinity,
                vmax =-Infinity,
                ordinal = false,
                val;

            if (!data) return;

            data.forEach(function (d) {
                val = accessor(d);
                if (!isDate(val))
                    val = +val;

                if (isNaN(val))
                    ordinal = true;
                else {
                    vmin = val < vmin ? val : vmin;
                    vmax = val > vmax ? val : vmax;
                }
            });

            if (!ordinal) return [vmin, vmax];
        }
    };

    g.serie = g.data.serie;
    //
    //  Build a multivariate data handler
    //
    //  data is an array of objects (records)
    g.data.multi = function () {
        var multi = g.data.serie(),
            keys;

        multi.key = function (key) {
            if (key && !isFunction(key)) key = label_functor(key);
            var data = multi.data();
            keys = null;
            if (key && data) {
                keys = {};
                data.forEach(function (d) {
                    keys[key(d)] = d;
                });
            }
            return multi;
        };

        // retrieve a record by key
        multi.get = function (key) {
            if (keys)
                return keys[key];
        };

        //  Build a single variate serie from this multi-variate serie
        multi.serie = function () {
            var label = multi.label();
            return g.data.serie()
                         .data(multi)
                         .label(label)
                         .x(multi.x() || label)
                         .y(multi.y());
        };

        return multi;
    };

    g.multi = g.data.multi;


    function label_functor (label) {
        return function (d) {
            return d[label];
        };
    }