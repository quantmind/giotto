require(rcfg.min(['lux/lux', 'dist/d3ext', 'angular-ui-router', 'angular-strap']), function (lux, d3) {

    var sitemap = function () {
        var s = ['sunburst',
                 'force',
                 {href: 'charts', label: 'Charting'},
                 {href: 'c3', name: 'time series'},
                 'trianglify'],
            all = [];
        //
        s.forEach(function (v) {
            if (typeof(v) === 'string')
                v = {href: v, name: v};
            v.href = lux.context.url + '/examples/' + v.href;
            all.push(v);
        });
        return all;
    };
    //
    lux.extend({
        navbar: {
            brand: 'd3ext',
            theme: 'default',
            items: [{href: 'https://github.com/quantmind/d3ext',
                     icon: 'fa fa-github fa-2x',
                     name: 'bla'}],
            items2: sitemap()
        }
    });
    //
    var examples = this.examples = {};



    examples.sigmoid = function (d3) {

        var X = d3.range(-2, 2, 0.1);

        return {
            data: [
                d3.ext.xyfunction(X, function (x) {
                    return 1/(1+Math.exp(-x));
                }),
                d3.ext.xyfunction(X, function (x) {
                    return x*x;
                })
            ]
        };
    };


    lux.addD3ext(d3)
        .bootstrap('d3extensions', ['lux.nav', 'd3viz']);
});