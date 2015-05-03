
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

    //
    //  Multivariate data
    //  =====================
    //
    //  Handle multivariate data
    g.data.multi = function (data) {
        var multi = {};

        // Build a serie frm this multivariate data
        multi.serie = function () {
            var serie = {},
                x, y;

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

            serie.forEach = function (callback) {
                if (data)
                    data.forEach(function (d) {
                        callback([x(d), y(d)]);
                    });
                return serie;
            };

            serie.all = function () {
                if (data)
                    return data.map(function (d) {
                        return [x(d), y(d)];
                    });
                else
                    return [];
            };

            return serie;
        };

        multi.map = function (key, values) {
            if (!isFunction(key)) key = label_functor(key);
            if (!isFunction(values)) values = label_functor(values);
            return d3.map(data.map(values), key);
        };

        function label_functor (label) {
            return function (d) {
                return d[label];
            };
        }

        return multi;
    };

    g.data.isData = function (data) {
        if (isObject(data) && g.data.isData(data.data)) return false;
        return data ? true : false;
    };
