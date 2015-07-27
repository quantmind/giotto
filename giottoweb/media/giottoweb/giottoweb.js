//
(function (root) {
    "use strict";

    if (!root.lux)
        root.lux = {};

    // If a file assign http as protocol (https does not work with PhantomJS)
    var protocol = root.location ? (root.location.protocol === 'file:' ? 'http:' : '') : '',
        end = '.js',
        ostring = Object.prototype.toString,
        lux = root.lux;


    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    function minify () {
        if (root.lux.context)
            return lux.context.MINIFIED_MEDIA;
    }

    function baseUrl () {
        if (root.lux.context)
            return lux.context.MEDIA_URL;
    }

    function extend (o1, o2) {
        if (o2) {
            for (var key in o2) {
                if (o2.hasOwnProperty(key))
                    o1[key] = o2[key];
            }
        }
        return o1;
    }

    function defaultPaths () {
        return {
            "angular": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular",
            "angular-animate": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-animate",
            "angular-mocks": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-mocks.js",
            "angular-sanitize": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-sanitize",
            "angular-touch": "//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular-touch",
            "angular-strap": "//cdnjs.cloudflare.com/ajax/libs/angular-strap/2.2.1/angular-strap",
            "angular-strap-tpl": "//cdnjs.cloudflare.com/ajax/libs/angular-strap/2.2.4/angular-strap.tpl",
            "angular-ui-router": "//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.14/angular-ui-router",
            "angular-pusher": "//cdn.jsdelivr.net/angular.pusher/latest/pusher-angular.min.js",
            "async": "//cdnjs.cloudflare.com/ajax/libs/requirejs-async/0.1.1/async.js",
            "pusher": "//js.pusher.com/2.2/pusher",
            "codemirror": "//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/codemirror",
            "codemirror-markdown": "//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/mode/markdown/markdown",
            "codemirror-javascript": "//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/mode/javascript/javascript",
            "codemirror-xml": "//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/mode/xml/xml",
            "codemirror-css": "//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/mode/css/css",
            "codemirror-htmlmixed": "//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/mode/htmlmixed/htmlmixed",
            "crossfilter": "//cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.11/crossfilter",
            "d3": "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3",
            "google-analytics": "//www.google-analytics.com/analytics.js",
            "gridster": "//cdnjs.cloudflare.com/ajax/libs/jquery.gridster/0.5.6/jquery.gridster",
            "holder": "//cdnjs.cloudflare.com/ajax/libs/holder/2.3.1/holder",
            "highlight": "//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.3/highlight.min.js",
            "katex": "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.0/katex.min.js",
            "leaflet": "//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js",
            "lodash": "//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash",
            "marked": "//cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked",
            "mathjax": "//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML",
            "moment": "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment",
            "restangular": "//cdnjs.cloudflare.com/ajax/libs/restangular/1.4.0/restangular",
            "sockjs": "//cdnjs.cloudflare.com/ajax/libs/sockjs-client/0.3.4/sockjs.min.js",
            "stats": "//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats",
            "topojson": "//cdnjs.cloudflare.com/ajax/libs/topojson/1.6.19/topojson"
        };
    }


    // Default shims
    function defaultShim () {
        return {
            angular: {
                exports: "angular"
            },
            "angular-strap-tpl": {
                deps: ["angular", "angular-strap"]
            },
            "google-analytics": {
                exports: root.GoogleAnalyticsObject || "ga"
            },
            highlight: {
                exports: "hljs"
            },
            lux: {
                deps: ["angular"]
            },
            "ui-bootstrap": {
                deps: ["angular"]
            },
            "codemirror": {
                exports: "CodeMirror"
            },
            "codemirror-markdown": {
                deps: ["codemirror"]
            },
            "codemirror-xml": {
                deps: ["codemirror"]
            },
            "codemirror-javascript": {
                deps: ["codemirror"]
            },
            "codemirror-css": {
                deps: ["codemirror"]
            },
            "codemirror-htmlmixed": {
                deps: ["codemirror", "codemirror-xml", "codemirror-javascript", "codemirror-css"],
            },
            restangular: {
                deps: ["angular"]
            },
            crossfilter: {
                exports: "crossfilter"
            },
            trianglify: {
                deps: ["d3"],
                exports: "Trianglify"
            },
            mathjax: {
                exports: "MathJax"
            }
        };
    }


    function newPaths (cfg) {
        var all = {},
            min = minify() ? '.min' : '',
            prefix = root.local_require_prefix,
            paths = extend(defaultPaths(), cfg.paths);

        for(var name in paths) {
            if(paths.hasOwnProperty(name)) {
                var path = paths[name];

                if (prefix && path.substring(0, prefix.length) === prefix)
                    path = path.substring(prefix.length);

                if (!cfg.shim[name]) {
                    // Add angular dependency
                    if (name.substring(0, 8) === "angular-")
                        cfg.shim[name] = {
                            deps: ["angular"]
                        };
                    else if (name.substring(0, 3) === "d3-")
                        cfg.shim[name] = {
                            deps: ["d3"]
                        };
                }

                if (typeof(path) !== 'string') {
                    // Don't maanipulate it, live it as it is
                    path = path.url;
                } else {
                    var params = path.split('?');
                    if (params.length === 2) {
                        path = params[0];
                        params = params[1];
                    } else
                        params = '';
                    if (path.substring(path.length-3) !== end)
                        path += min;
                    if (params) {
                        if (path.substring(path.length-3) !== end)
                            path += end;
                        path += '?' + params;
                    }
                    // Add protocol
                    if (path.substring(0, 2) === '//' && protocol)
                        path = protocol + path;

                    if (path.substring(path.length-3) === end)
                        path = path.substring(0, path.length-3);
                }
                all[name] = path;
            }
        }
        return all;
    }

    // require.config override
    lux.config = function (cfg) {
        if(!cfg.baseUrl) {
            var url = baseUrl();
            if (url !== undefined) cfg.baseUrl = url;
        }
        cfg.shim = extend(defaultShim(), cfg.shim);
        cfg.paths = newPaths(cfg);
        require.config(cfg);
    };

}(this));

lux.config({
    paths: {
        "lux": "lux/lux",
        "giotto": "/giotto/giotto",
        "d3-geo-projection": "/vendor/d3-geo-projection/d3.geo.projection",
        trianglify: "//cdnjs.cloudflare.com/ajax/libs/trianglify/0.2.0/trianglify.min"
    }
});

//
//  Script for giotto website
//  =============================
require(['lux', 'giotto', 'd3-geo-projection', 'angular-ui-router', 'angular-strap'], function (lux, d3) {
    "use strict";

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
        scroll: {
            offset: 60
        },
        navbar: {
            brand: 'GiottoJS',
            //brandImage: lux.media('giottoweb/giotto.svg'),
            theme: 'default',
            top: true,
            fixed: true,
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
    var examples = window.examples = {},
        g = d3.giotto;



    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    angular.module('giottoweb', ['lux.bs'])

        .controller('GiottoExample', ['$scope', '$location', function (scope, $loction) {
            scope.giottoThemes = [
                {
                    name: 'light',
                    title: 'Light theme',
                    url: lux.media('giottoweb/light.min.css')
                },
                {
                    name: 'dark',
                    title: 'Dark theme',
                    url: lux.media('giottoweb/dark.min.css')
                }
            ];

            scope.currentTheme = 'light';

            scope.selectTheme = function (e, theme) {
                if (e) e.preventDefault();
                if (theme && theme !== scope.currentTheme) {
                    var url = lux.media('giottoweb/' + theme + '.min.css'),
                        link = angular.element(lux.querySelector(document, '#giotto-theme'));
                    link.attr('href', url);
                    scope.currentTheme = theme;
                    scope.$broadcast('changeTheme', theme);
                }
            };

            scope.selectTheme(null, getParameterByName('style'));
        }]);

    g.quandl = {

        baseurl: 'https://www.quandl.com/api/v1/datasets/',

        apikey: 'v3ebx8S9fs6aSWr473av',

        url: function (url) {
            url = g.quandl.baseurl + url + '?auth_token=' + g.quandl.apikey;
            return url;
        }
    };
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
    d3.colorbrewer = {
        YlGn: {
            3: ["#f7fcb9", "#addd8e", "#31a354"],
            4: ["#ffffcc", "#c2e699", "#78c679", "#238443"],
            5: ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"],
            6: ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#31a354", "#006837"],
            7: ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
            8: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
            9: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"]
        },
        YlGnBu: {
            3: ["#edf8b1", "#7fcdbb", "#2c7fb8"],
            4: ["#ffffcc", "#a1dab4", "#41b6c4", "#225ea8"],
            5: ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
            6: ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"],
            7: ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
            8: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
            9: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"]
        },
        GnBu: {
            3: ["#e0f3db", "#a8ddb5", "#43a2ca"],
            4: ["#f0f9e8", "#bae4bc", "#7bccc4", "#2b8cbe"],
            5: ["#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac"],
            6: ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#43a2ca", "#0868ac"],
            7: ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
            8: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
            9: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"]
        },
        BuGn: {
            3: ["#e5f5f9", "#99d8c9", "#2ca25f"],
            4: ["#edf8fb", "#b2e2e2", "#66c2a4", "#238b45"],
            5: ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"],
            6: ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#2ca25f", "#006d2c"],
            7: ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
            8: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
            9: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"]
        },
        PuBuGn: {
            3: ["#ece2f0", "#a6bddb", "#1c9099"],
            4: ["#f6eff7", "#bdc9e1", "#67a9cf", "#02818a"],
            5: ["#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59"],
            6: ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#1c9099", "#016c59"],
            7: ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
            8: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
            9: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"]
        },
        PuBu: {
            3: ["#ece7f2", "#a6bddb", "#2b8cbe"],
            4: ["#f1eef6", "#bdc9e1", "#74a9cf", "#0570b0"],
            5: ["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"],
            6: ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#2b8cbe", "#045a8d"],
            7: ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
            8: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
            9: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"]
        },
        BuPu: {
            3: ["#e0ecf4", "#9ebcda", "#8856a7"],
            4: ["#edf8fb", "#b3cde3", "#8c96c6", "#88419d"],
            5: ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"],
            6: ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8856a7", "#810f7c"],
            7: ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
            8: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
            9: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]
        },
        RdPu: {
            3: ["#fde0dd", "#fa9fb5", "#c51b8a"],
            4: ["#feebe2", "#fbb4b9", "#f768a1", "#ae017e"],
            5: ["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"],
            6: ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#c51b8a", "#7a0177"],
            7: ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
            8: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
            9: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"]
        },
        PuRd: {
            3: ["#e7e1ef", "#c994c7", "#dd1c77"],
            4: ["#f1eef6", "#d7b5d8", "#df65b0", "#ce1256"],
            5: ["#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043"],
            6: ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#dd1c77", "#980043"],
            7: ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
            8: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
            9: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"]
        },
        OrRd: {
            3: ["#fee8c8", "#fdbb84", "#e34a33"],
            4: ["#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f"],
            5: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
            6: ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"],
            7: ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
            8: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
            9: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]
        },
        YlOrRd: {
            3: ["#ffeda0", "#feb24c", "#f03b20"],
            4: ["#ffffb2", "#fecc5c", "#fd8d3c", "#e31a1c"],
            5: ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"],
            6: ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"],
            7: ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
            8: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
            9: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"]
        },
        YlOrBr: {
            3: ["#fff7bc", "#fec44f", "#d95f0e"],
            4: ["#ffffd4", "#fed98e", "#fe9929", "#cc4c02"],
            5: ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"],
            6: ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404"],
            7: ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
            8: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
            9: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]
        },
        Purples: {
            3: ["#efedf5", "#bcbddc", "#756bb1"],
            4: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#6a51a3"],
            5: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"],
            6: ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"],
            7: ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
            8: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
            9: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"]
        },
        Blues: {
            3: ["#deebf7", "#9ecae1", "#3182bd"],
            4: ["#eff3ff", "#bdd7e7", "#6baed6", "#2171b5"],
            5: ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"],
            6: ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"],
            7: ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
            8: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
            9: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]
        },
        Greens: {
            3: ["#e5f5e0", "#a1d99b", "#31a354"],
            4: ["#edf8e9", "#bae4b3", "#74c476", "#238b45"],
            5: ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
            6: ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"],
            7: ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
            8: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
            9: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"]
        },
        Oranges: {
            3: ["#fee6ce", "#fdae6b", "#e6550d"],
            4: ["#feedde", "#fdbe85", "#fd8d3c", "#d94701"],
            5: ["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"],
            6: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#e6550d", "#a63603"],
            7: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
            8: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
            9: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"]
        },
        Reds: {
            3: ["#fee0d2", "#fc9272", "#de2d26"],
            4: ["#fee5d9", "#fcae91", "#fb6a4a", "#cb181d"],
            5: ["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"],
            6: ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"],
            7: ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
            8: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
            9: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]
        },
        Greys: {
            3: ["#f0f0f0", "#bdbdbd", "#636363"],
            4: ["#f7f7f7", "#cccccc", "#969696", "#525252"],
            5: ["#f7f7f7", "#cccccc", "#969696", "#636363", "#252525"],
            6: ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#636363", "#252525"],
            7: ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
            8: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
            9: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"]
        },
        PuOr: {
            3: ["#f1a340", "#f7f7f7", "#998ec3"],
            4: ["#e66101", "#fdb863", "#b2abd2", "#5e3c99"],
            5: ["#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99"],
            6: ["#b35806", "#f1a340", "#fee0b6", "#d8daeb", "#998ec3", "#542788"],
            7: ["#b35806", "#f1a340", "#fee0b6", "#f7f7f7", "#d8daeb", "#998ec3", "#542788"],
            8: ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
            9: ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
            10: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
            11: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"]
        },
        BrBG: {
            3: ["#d8b365", "#f5f5f5", "#5ab4ac"],
            4: ["#a6611a", "#dfc27d", "#80cdc1", "#018571"],
            5: ["#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571"],
            6: ["#8c510a", "#d8b365", "#f6e8c3", "#c7eae5", "#5ab4ac", "#01665e"],
            7: ["#8c510a", "#d8b365", "#f6e8c3", "#f5f5f5", "#c7eae5", "#5ab4ac", "#01665e"],
            8: ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
            9: ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
            10: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
            11: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"]
        },
        PRGn: {
            3: ["#af8dc3", "#f7f7f7", "#7fbf7b"],
            4: ["#7b3294", "#c2a5cf", "#a6dba0", "#008837"],
            5: ["#7b3294", "#c2a5cf", "#f7f7f7", "#a6dba0", "#008837"],
            6: ["#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837"],
            7: ["#762a83", "#af8dc3", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#7fbf7b", "#1b7837"],
            8: ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
            9: ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
            10: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
            11: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"]
        },
        PiYG: {
            3: ["#e9a3c9", "#f7f7f7", "#a1d76a"],
            4: ["#d01c8b", "#f1b6da", "#b8e186", "#4dac26"],
            5: ["#d01c8b", "#f1b6da", "#f7f7f7", "#b8e186", "#4dac26"],
            6: ["#c51b7d", "#e9a3c9", "#fde0ef", "#e6f5d0", "#a1d76a", "#4d9221"],
            7: ["#c51b7d", "#e9a3c9", "#fde0ef", "#f7f7f7", "#e6f5d0", "#a1d76a", "#4d9221"],
            8: ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
            9: ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
            10: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
            11: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"]
        },
        RdBu: {
            3: ["#ef8a62", "#f7f7f7", "#67a9cf"],
            4: ["#ca0020", "#f4a582", "#92c5de", "#0571b0"],
            5: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"],
            6: ["#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac"],
            7: ["#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac"],
            8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
            9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
            10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
            11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"]
        },
        RdGy: {
            3: ["#ef8a62", "#ffffff", "#999999"],
            4: ["#ca0020", "#f4a582", "#bababa", "#404040"],
            5: ["#ca0020", "#f4a582", "#ffffff", "#bababa", "#404040"],
            6: ["#b2182b", "#ef8a62", "#fddbc7", "#e0e0e0", "#999999", "#4d4d4d"],
            7: ["#b2182b", "#ef8a62", "#fddbc7", "#ffffff", "#e0e0e0", "#999999", "#4d4d4d"],
            8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
            9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
            10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
            11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"]
        },
        RdYlBu: {
            3: ["#fc8d59", "#ffffbf", "#91bfdb"],
            4: ["#d7191c", "#fdae61", "#abd9e9", "#2c7bb6"],
            5: ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],
            6: ["#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4"],
            7: ["#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4"],
            8: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
            9: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
            10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
            11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"]
        },
        Spectral: {
            3: ["#fc8d59", "#ffffbf", "#99d594"],
            4: ["#d7191c", "#fdae61", "#abdda4", "#2b83ba"],
            5: ["#d7191c", "#fdae61", "#ffffbf", "#abdda4", "#2b83ba"],
            6: ["#d53e4f", "#fc8d59", "#fee08b", "#e6f598", "#99d594", "#3288bd"],
            7: ["#d53e4f", "#fc8d59", "#fee08b", "#ffffbf", "#e6f598", "#99d594", "#3288bd"],
            8: ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
            9: ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
            10: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
            11: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"]
        },
        RdYlGn: {
            3: ["#fc8d59", "#ffffbf", "#91cf60"],
            4: ["#d7191c", "#fdae61", "#a6d96a", "#1a9641"],
            5: ["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"],
            6: ["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850"],
            7: ["#d73027", "#fc8d59", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60", "#1a9850"],
            8: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
            9: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
            10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
            11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"]
        },
        Accent: {
            3: ["#7fc97f", "#beaed4", "#fdc086"],
            4: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99"],
            5: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0"],
            6: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f"],
            7: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17"],
            8: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"]
        },
        Dark2: {
            3: ["#1b9e77", "#d95f02", "#7570b3"],
            4: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a"],
            5: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e"],
            6: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"],
            7: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d"],
            8: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"]
        },
        Paired: {
            3: ["#a6cee3", "#1f78b4", "#b2df8a"],
            4: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c"],
            5: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99"],
            6: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c"],
            7: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f"],
            8: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00"],
            9: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6"],
            10: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"],
            11: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99"],
            12: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"]
        },
        Pastel1: {
            3: ["#fbb4ae", "#b3cde3", "#ccebc5"],
            4: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4"],
            5: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"],
            6: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc"],
            7: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd"],
            8: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec"],
            9: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]
        },
        Pastel2: {
            3: ["#b3e2cd", "#fdcdac", "#cbd5e8"],
            4: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4"],
            5: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9"],
            6: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae"],
            7: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc"],
            8: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"]
        },
        Set1: {
            3: ["#e41a1c", "#377eb8", "#4daf4a"],
            4: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"],
            5: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"],
            6: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33"],
            7: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628"],
            8: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf"],
            9: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"]
        },
        Set2: {
            3: ["#66c2a5", "#fc8d62", "#8da0cb"],
            4: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3"],
            5: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854"],
            6: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f"],
            7: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"],
            8: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]
        },
        Set3: {
            3: ["#8dd3c7", "#ffffb3", "#bebada"],
            4: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072"],
            5: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3"],
            6: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462"],
            7: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69"],
            8: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5"],
            9: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9"],
            10: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd"],
            11: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5"],
            12: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]
        }
    };

    d3.giotto.angular.module(angular).addAll();

    lux.bootstrap('giottoExamples', ['lux.nav', 'giotto', 'giottoweb']);

    // Process giottoQueue
    if (window.giottoQueue) {
        var queue = window.giottoQueue;
        window.giottoQueue = [];
        queue.forEach(function (callback) {
            callback();
        });
    }
});