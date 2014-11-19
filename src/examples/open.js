//
//  Script for giotto website
//  =============================
require(rcfg.min(['lux/lux', 'giotto/giotto', 'angular-ui-router', 'angular-strap']), function (lux, d3) {

    var url = lux.context.url,
        sitemap = function () {
        var s = ['sunburst',
                 'force',
                 {href: 'charts', label: 'Charting'},
                 {href: 'giotto', label: 'Logo'},
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
    var examples = this.examples = {},
        g = d3.giotto;
