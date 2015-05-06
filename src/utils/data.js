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

    g.data.serie = function () {
        var serie = {},
            data,
            x, y, label;

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
                data.forEach(function (d) {
                    callback([x(d), y(d)]);
                });
            return serie;
        };

        //  Get a value at key
        //  the data must implement the get function
        serie.get = function (key) {
            if (data && isFunction(data.get))
                return data.get(key);
        };

        return serie;
    };

    //
    //  Build a multivariate data handler
    //
    //  data is an array of objects (records)
    g.data.multi = function (data) {
        var multi = g.data.serie(),
            label,
            keys;

        multi.key = function (key) {
            if (key && !isFunction(key)) key = label_functor(key);
            keys = null;
            if (key && data) {
                keys = {};
                data.forEach(function (data) {
                    keys[key(data)] = data;
                });
            }
            return multi;
        };

        // retrieve a record by key
        multi.get = function (key) {
            if (keys)
                return keys[key];
        };

        multi.serie = function () {
            return g.data.serie()
                         .data(multi)
                         .label(label)
                         .x(x || label)
                         .y(y);
        };

        return multi;
    };


    function label_functor (label) {
        return function (d) {
            return d[label];
        };
    }