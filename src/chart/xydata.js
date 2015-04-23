
    var xyData = function (data, x, y) {
        if (!data) return;
        if (!data.data) data = {data: data};

        var xy = data.data,
            xmin = Infinity,
            ymin = Infinity,
            xmax =-Infinity,
            ymax =-Infinity,
            xordinal = false,
            yordinal = false,
            v,
            xm = function (x) {
                v = +x;
                if (isNaN(v)) {
                    xordinal = true;
                    return x;
                }
                else {
                    xmin = v < xmin ? v : xmin;
                    xmax = v > xmax ? v : xmax;
                    return v;
                }
            },
            ym = function (y) {
                v = +y;
                if (isNaN(v)) {
                    yordinal = true;
                    return y;
                }
                else {
                    ymin = v < ymin ? v : ymin;
                    ymax = v > ymax ? v : ymax;
                    return v;
                }
            };
        var xydata = [];
        xy.forEach(function (d) {
            xydata.push({x: xm(x(d)), y: ym(y(d))});
        });
        data.data = xydata;
        data.xrange = [xmin, xmax];
        data.yrange = [ymin, ymax];
        data.xordinal = xordinal;
        data.yordinal = yordinal;
        return data;
    };
