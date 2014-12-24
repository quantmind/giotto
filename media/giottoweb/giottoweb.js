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
            brand: 'GiottoJS',
            //brandImage: lux.media('giottoweb/giotto.svg'),
            theme: 'inverse',
            top: true,
            fixed: true,
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

    var height = 200;

    gexamples.chartFeature = {
        height: height,
        data: [
        {
            point: {
                size: '12px'
            },
            line: {
                lineWidth: 2
            },
            data: [[1, 3], [2, 2], [3, 5], [4, 6], [5, 4], [6, -1], [7, 1], [8, 0]]
        } ]
    };

    gexamples.barFeature = {
        height: height,
        xaxis: {show: false},
        yaxis: {show: false, min: 0, max: 1.5},
        bar: {
            show: true,
            fill: '#D79404',
            lineWidth: 1,
            transition: {
                duration: 1000,
                ease: 'linear'
            }
        },
        data: [randomData(10, 1, 0.3)],

        onInit: function (chart, opts) {

            function animate () {
                chart.each(function (serie) {
                    serie.data(randomData(10, 1, 0.3));
                });
                chart.resume();
                d3.timer(animate, 2*opts.bar.transition.duration);
                return true;
            }

            animate();
        }
    };

    gexamples.svgCanvas = {
        height: height,
        margin: 0,
        onInit: function (viz, opts) {
            var paper = viz.paper(),
                group = paper.group({type: 'svg'});

            group.add(function () {
                var g = group.element().style({'text-anchor': 'middle',
                                               'stroke': '#333',
                                               'stroke-width': '1px',
                                               'font-size': '50px'}),
                    x = group.innerWidth()/2;
                g.selectAll('*').remove();
                g.append('text')
                    .attr('y', 70)
                    .attr('x', x)
                    .attr('fill', '#0570b0')
                    .text('<svg>');
                g.append('text')
                    .attr('y', 130)
                    .attr('x', x)
                    .attr('fill', '#cc4c02')
                    .text('<canvas>');
            }).render();
        }
    };

    gexamples.pieFeature = {
        height: height,
        type: 'canvas',
        tooltip: {show: true},
        xaxis: {show: false},
        yaxis: {show: false, min: 0, max: 1.5},
        pie: {
            show: true,
            lineWidth: 1,
            innerRadius: 0.6,
            padAngle: 2,
            cornerRadius: 0.01,
            active: {
                outerRadius: '105%'
            }
        },
        data: [randomData(10, 5, 2)],
    };

    function randomData (N, µ, σ) {
        // Create a random path
        var data = [],
            norm = d3.random.normal(µ, σ);
        d3.range(0, N, 1).forEach(function (x) {
            data.push([x, norm()]);
        });
        return data;
    }

    d3.giotto.angular.module(angular).addAll();

    lux.bootstrap('giottoExamples', ['lux.nav', 'giotto']);
});