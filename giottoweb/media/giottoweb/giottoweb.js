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
                 {href: 'c3', label: 'time series'},
                 'trianglify'],
            all = [];
        //
        s.forEach(function (v) {
            if (typeof(v) === 'string')
                v = {href: v, label: v};
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
            top: true,
            target: '_self',
            itemsRight: [
                {
                    href: url + '/examples/',
                    icon: 'fa fa-bar-chart',
                    label: 'examples',
                    target: '_self'
                },
                {
                    href: url + '/api/',
                    icon: 'fa fa-cogs',
                    label: 'api',
                    target: '_self'
                },
                {
                    href: 'https://github.com/quantmind/giotto',
                    icon: 'fa fa-github'
                }
            ],
            items2: sitemap()
        }
    });
    //
    var examples = this.examples = {},
        g = d3.giotto;



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


    g.Giotto = g.Viz.extend({

        d3build: function () {
            var self = this,
                paper = this.paper();

            paper.group().attr('class', 'containers');
            paper.xAxis().scale().domain([-1, 1]);
            paper.yAxis().scale().domain([-1, 1]);
            paper.rect(-1, -1, 2, 2).attr('fill', 'none');
            paper.circle(0, 0, 1).attr('fill', 'none');
            paper.root().group().attr('class', 'random');
            var anim = {total: 0, circle: 0, frame: 0};
            d3.timer(function () {
                return self._step(anim);
            });
        },

        _step: function (anim) {
            var i = 0, self = this, x, y, r2, pi;
            while (i < 4) {
                ++i;
                x = 2*(Math.random() - 0.5);
                y = 2*(Math.random() - 0.5);
                r2 = x*x + y*y;
                anim.total += 1;
                if (r2 <= 1)
                    anim.circle += 1;

                pi = 4*anim.circle/anim.total;

                this.paper().circle(x, y, 0.02);
            }
            d3.timer(function () {
                return self._step(anim);
            });
            return true;
        }
    });


    d3.giotto.angular.addAll(angular);

    lux.bootstrap('d3extensions', ['lux.nav', 'giotto']);
});