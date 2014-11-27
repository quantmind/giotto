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
                    label: 'examples'
                },
                {
                    href: url + '/api/',
                    icon: 'fa fa-cogs',
                    label: 'api'
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


    examples.sunburst = function (viz) {
        var scope = viz.options().scope;
        scope.$on('formFieldChange', function (e, o, value) {
            if (o && o.field === 'scale')
                viz.scale(o.form.scale);
        });
    };

    examples.force1 = function (force) {
        var opts = force.options(),
            root = {fixed: true, radius: 0},
            paper = force.paper(),
            charge = force.charge();

        force.addNode(root);

        force.charge(function (d) {
            return d.fixed ? charge : 0;
        }).drawCircles();

        paper.current().on("mousemove", function() {
            var p1 = d3.mouse(this);
            root.px = paper.xAxis().scale().invert(p1[0]);
            root.py = paper.yAxis().scale().invert(p1[1]);
            force.resume();
        }).on("touchmove", function() {
            var p1 = d3.touches(this);
            root.px = paper.xAxis().scale().invert(p1[0]);
            root.py = paper.yAxis().scale().invert(p1[1]);
            force.resume();
        });

        force.on("tick", function(e) {
            paper.current().selectAll("circle")
                .attr("cx", function (d) { return paper.scalex(d.x); })
                .attr("cy", function (d) { return paper.scaley(d.y); });
        });
    };

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

    lux.bootstrap('giottoExamples', ['lux.nav', 'giotto']);
});