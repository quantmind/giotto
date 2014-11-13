//
//  Script for giotto website
//  =============================
require(rcfg.min(['lux/lux', 'giotto/giotto', 'angular-ui-router', 'angular-strap']), function (lux, d3) {

    var url = lux.context.url,
        sitemap = function () {
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
            v.href = url + '/examples/' + v.href;
            all.push(v);
        });
        return all;
    };
    //
    lux.extend({
        navbar: {
            brand: 'Giotto',
            theme: 'default',
            items: [
                {
                    href: url + '/api/',
                    icon: 'fa fa-cogs fa-2x',
                    label: 'api'
                },
                {
                    href: 'https://github.com/quantmind/giotto',
                    icon: 'fa fa-github fa-2x',
                    name: 'bla'
                }
            ],
            items2: sitemap()
        }
    });
    //
    var examples = this.examples = {};



    examples.sigmoid = function () {

        var X = d3.range(-2, 2, 0.1);

        return {
            data: [
                d3.giotto.xyfunction(X, function (x) {
                    return 1/(1+Math.exp(-x));
                }),
                d3.giotto.xyfunction(X, function (x) {
                    return x*x;
                })
            ]
        };
    };


    d3.giotto.angular.addAll(angular);

    lux.bootstrap('d3extensions', ['lux.nav', 'giotto']);
});