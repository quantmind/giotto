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
