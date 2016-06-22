/* eslint-plugin-disable angular */
define('lux/config/lux',[],function () {
    'use strict';

    var root = window,
        lux = root.lux || {},
        ostring = Object.prototype.toString;

    if (isString(lux))
        lux = {context: urlBase64DecodeToJSON(lux)};
    else if (lux.root)
        return lux;

    root.lux = lux;

    lux.root = root;
    lux.require = extend(lux.require);
    lux.extend = extend;
    lux.isString = isString;
    lux.isArray = isArray;
    lux.isObject = isObject;
    lux.urlBase64Decode = urlBase64Decode;
    lux.urlBase64DecodeToJSON = urlBase64DecodeToJSON;

    return lux;

    function extend () {
        var length = arguments.length,
            object = arguments[0],
            index = 0,
            obj;

        if (!object) object = {};
        while (++index < length) {
            obj = arguments[index];
            if (isObject(obj))
                for (var key in obj) {
                    if (obj.hasOwnProperty(key))
                        object[key] = obj[key];
                }
        }
        return object;
    }

    function isString (value) {
        return ostring.call(value) === '[object String]';
    }

    function isArray (value) {
        return ostring.call(value) === '[object Array]';
    }

    function isObject (value) {
        return ostring.call(value) === '[object Object]';
    }

    function urlBase64Decode (str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0: { break; }
            case 2: { output += '=='; break; }
            case 3: { output += '='; break; }
            default: {
                throw 'Illegal base64url string!';
            }
        }
        //polifyll https://github.com/davidchambers/Base64.js
        return decodeURIComponent(escape(window.atob(output)));
    }

    function urlBase64DecodeToJSON (str) {
        var decoded = urlBase64Decode(str);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    }

});

define('lux/config/paths',[],function () {
    'use strict';

    return function () {
        return {
            'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular',
            'angular-animate': '//ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular-animate',
            'angular-mocks': '//ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular-mocks.js',
            'angular-sanitize': '//ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular-sanitize',
            'angular-touch': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.9/angular-touch',
            'angular-ui-bootstrap': 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.0.3/ui-bootstrap-tpls',
            'angular-ui-router': '//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.14/angular-ui-router',
            'angular-ui-select': '//cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.14.9/select',
            'angular-cookies': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.9/angular-cookies',
            'angular-ui-grid': '//cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/3.1.1/ui-grid',
            'angular-scroll': '//cdnjs.cloudflare.com/ajax/libs/angular-scroll/0.7.2/angular-scroll',
            'angular-file-upload': '//cdnjs.cloudflare.com/ajax/libs/danialfarid-angular-file-upload/10.0.2/ng-file-upload',
            'angular-infinite-scroll': '//cdnjs.cloudflare.com/ajax/libs/ngInfiniteScroll/1.2.1/ng-infinite-scroll',
            'angular-moment': '//cdnjs.cloudflare.com/ajax/libs/angular-moment/0.10.1/angular-moment',
            'angular-pusher': '//cdn.jsdelivr.net/angular.pusher/latest/pusher-angular.min.js',
            'videojs': '//vjs.zencdn.net/4.12/video.js',
            'async': '//cdnjs.cloudflare.com/ajax/libs/requirejs-async/0.1.1/async.js',
            'pusher': '//js.pusher.com/2.2/pusher',
            'codemirror': '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/codemirror',
            'codemirror-markdown': '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/mode/markdown/markdown',
            'codemirror-javascript': '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/mode/javascript/javascript',
            'codemirror-python': '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/mode/python/python.js',
            'codemirror-xml': '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/mode/xml/xml',
            'codemirror-css': '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/mode/css/css',
            'codemirror-htmlmixed': '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/mode/htmlmixed/htmlmixed',
            'crossfilter': '//cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.12/crossfilter',
            'd3': '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3',
            'google-analytics': '//www.google-analytics.com/analytics.js',
            'gridster': '//cdnjs.cloudflare.com/ajax/libs/jquery.gridster/0.5.6/jquery.gridster',
            'holder': '//cdnjs.cloudflare.com/ajax/libs/holder/2.3.1/holder',
            'highlight': '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.1.0/highlight.min.js',
            'katex': '//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.js',
            'leaflet': '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js',
            'lodash': '//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash',
            'marked': '//cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked',
            'mathjax': '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
            'moment': '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment',
            'restangular': '//cdnjs.cloudflare.com/ajax/libs/restangular/1.4.0/restangular',
            'sockjs': '//cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.0.3/sockjs',
            'stats': '//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats',
            'topojson': '//cdnjs.cloudflare.com/ajax/libs/topojson/1.6.19/topojson'
        };
    };

});

define('lux/config/shim',[],function () {
    'use strict';
    // Default shim
    return function (root) {
        return {
            angular: {
                exports: 'angular'
            },
            'angular-strap-tpl': {
                deps: ['angular', 'angular-strap']
            },
            'google-analytics': {
                exports: root.GoogleAnalyticsObject || 'ga'
            },
            highlight: {
                exports: 'hljs'
            },
            'codemirror': {
                exports: 'CodeMirror'
            },
            'codemirror-htmlmixed': {
                deps: ['codemirror', 'codemirror-xml', 'codemirror-javascript', 'codemirror-css']
            },
            restangular: {
                deps: ['angular']
            },
            crossfilter: {
                exports: 'crossfilter'
            },
            trianglify: {
                deps: ['d3'],
                exports: 'Trianglify'
            },
            mathjax: {
                exports: 'MathJax'
            }
        };
    };

});

/* eslint-plugin-disable angular */
define('lux/config/main',['lux/config/lux',
        'lux/config/paths',
        'lux/config/shim'], function (lux, defaultPaths, defaultShim) {
    'use strict';

    // If a file assign http as protocol (https does not work with PhantomJS)
    var root = lux.root,
        protocol = root.location ? (root.location.protocol === 'file:' ? 'http:' : '') : '',
        end = '.js';

    // require.config override
    lux.config = function (cfg) {
        cfg = lux.extend(cfg, lux.require);
        if(!cfg.baseUrl) {
            var url = baseUrl();
            if (url !== undefined) cfg.baseUrl = url;
        }
        cfg.shim = lux.extend(defaultShim(root), cfg.shim);
        cfg.paths = newPaths(cfg);
        require.config(cfg);
    };

    return lux;

    function newPaths (cfg) {
        var all = {},
            min = minify() ? '.min' : '',
            prefix = root.local_require_prefix,
            paths = lux.extend(defaultPaths(), cfg.paths);

        for(var name in paths) {
            if(paths.hasOwnProperty(name)) {
                var path = paths[name];

                if (prefix && path.substring(0, prefix.length) === prefix)
                    path = path.substring(prefix.length);

                if (!cfg.shim[name]) {
                    // Add angular dependency
                    if (name.substring(0, 8) === 'angular-')
                        cfg.shim[name] = {
                            deps: ['angular']
                        };
                    else if (name.substring(0, 3) === 'd3-')
                        cfg.shim[name] = {
                            deps: ['d3']
                        };
                    else if (name.substring(0, 11) === 'codemirror-')
                        cfg.shim[name] = {
                            deps: ['codemirror']
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

    function baseUrl () {
        if (lux.context)
            return lux.context.MEDIA_URL;
    }

    function minify () {
        if (lux.context)
            return lux.context.MINIFIED_MEDIA;
    }
});


/* eslint-plugin-disable angular */
define('js/require.config',['lux/config/main'], function (lux) {
    'use strict';

    var localRequiredPath = lux.PATH_TO_LOCAL_REQUIRED_FILES || '';

    lux.require.paths = lux.extend(lux.require.paths, {
        'giotto': localRequiredPath + 'giottojs/giotto'
    });

    lux.config();

    return lux;
});

define('js/colorbrewer',[],function() {

    return {
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
});

// Released under MIT license
// Copyright (c) 2009-2010 Dominic Baggott
// Copyright (c) 2009-2010 Ash Berlin
// Copyright (c) 2011 Christoph Dorn <christoph@christophdorn.com> (http://www.christophdorn.com)

/*jshint browser:true, devel:true */

(function( expose ) {

/**
 *  class Markdown
 *
 *  Markdown processing in Javascript done right. We have very particular views
 *  on what constitutes 'right' which include:
 *
 *  - produces well-formed HTML (this means that em and strong nesting is
 *    important)
 *
 *  - has an intermediate representation to allow processing of parsed data (We
 *    in fact have two, both as [JsonML]: a markdown tree and an HTML tree).
 *
 *  - is easily extensible to add new dialects without having to rewrite the
 *    entire parsing mechanics
 *
 *  - has a good test suite
 *
 *  This implementation fulfills all of these (except that the test suite could
 *  do with expanding to automatically run all the fixtures from other Markdown
 *  implementations.)
 *
 *  ##### Intermediate Representation
 *
 *  *TODO* Talk about this :) Its JsonML, but document the node names we use.
 *
 *  [JsonML]: http://jsonml.org/ "JSON Markup Language"
 **/
var Markdown = expose.Markdown = function(dialect) {
  switch (typeof dialect) {
    case "undefined":
      this.dialect = Markdown.dialects.Gruber;
      break;
    case "object":
      this.dialect = dialect;
      break;
    default:
      if ( dialect in Markdown.dialects ) {
        this.dialect = Markdown.dialects[dialect];
      }
      else {
        throw new Error("Unknown Markdown dialect '" + String(dialect) + "'");
      }
      break;
  }
  this.em_state = [];
  this.strong_state = [];
  this.debug_indent = "";
};

/**
 *  parse( markdown, [dialect] ) -> JsonML
 *  - markdown (String): markdown string to parse
 *  - dialect (String | Dialect): the dialect to use, defaults to gruber
 *
 *  Parse `markdown` and return a markdown document as a Markdown.JsonML tree.
 **/
expose.parse = function( source, dialect ) {
  // dialect will default if undefined
  var md = new Markdown( dialect );
  return md.toTree( source );
};

/**
 *  toHTML( markdown, [dialect]  ) -> String
 *  toHTML( md_tree ) -> String
 *  - markdown (String): markdown string to parse
 *  - md_tree (Markdown.JsonML): parsed markdown tree
 *
 *  Take markdown (either as a string or as a JsonML tree) and run it through
 *  [[toHTMLTree]] then turn it into a well-formated HTML fragment.
 **/
expose.toHTML = function toHTML( source , dialect , options ) {
  var input = expose.toHTMLTree( source , dialect , options );

  return expose.renderJsonML( input );
};

/**
 *  toHTMLTree( markdown, [dialect] ) -> JsonML
 *  toHTMLTree( md_tree ) -> JsonML
 *  - markdown (String): markdown string to parse
 *  - dialect (String | Dialect): the dialect to use, defaults to gruber
 *  - md_tree (Markdown.JsonML): parsed markdown tree
 *
 *  Turn markdown into HTML, represented as a JsonML tree. If a string is given
 *  to this function, it is first parsed into a markdown tree by calling
 *  [[parse]].
 **/
expose.toHTMLTree = function toHTMLTree( input, dialect , options ) {
  // convert string input to an MD tree
  if ( typeof input ==="string" ) input = this.parse( input, dialect );

  // Now convert the MD tree to an HTML tree

  // remove references from the tree
  var attrs = extract_attr( input ),
      refs = {};

  if ( attrs && attrs.references ) {
    refs = attrs.references;
  }

  var html = convert_tree_to_html( input, refs , options );
  merge_text_nodes( html );
  return html;
};

// For Spidermonkey based engines
function mk_block_toSource() {
  return "Markdown.mk_block( " +
          uneval(this.toString()) +
          ", " +
          uneval(this.trailing) +
          ", " +
          uneval(this.lineNumber) +
          " )";
}

// node
function mk_block_inspect() {
  var util = require("util");
  return "Markdown.mk_block( " +
          util.inspect(this.toString()) +
          ", " +
          util.inspect(this.trailing) +
          ", " +
          util.inspect(this.lineNumber) +
          " )";

}

var mk_block = Markdown.mk_block = function(block, trail, line) {
  // Be helpful for default case in tests.
  if ( arguments.length == 1 ) trail = "\n\n";

  var s = new String(block);
  s.trailing = trail;
  // To make it clear its not just a string
  s.inspect = mk_block_inspect;
  s.toSource = mk_block_toSource;

  if ( line != undefined )
    s.lineNumber = line;

  return s;
};

function count_lines( str ) {
  var n = 0, i = -1;
  while ( ( i = str.indexOf("\n", i + 1) ) !== -1 ) n++;
  return n;
}

// Internal - split source into rough blocks
Markdown.prototype.split_blocks = function splitBlocks( input, startLine ) {
  input = input.replace(/(\r\n|\n|\r)/g, "\n");
  // [\s\S] matches _anything_ (newline or space)
  // [^] is equivalent but doesn't work in IEs.
  var re = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,
      blocks = [],
      m;

  var line_no = 1;

  if ( ( m = /^(\s*\n)/.exec(input) ) != null ) {
    // skip (but count) leading blank lines
    line_no += count_lines( m[0] );
    re.lastIndex = m[0].length;
  }

  while ( ( m = re.exec(input) ) !== null ) {
    if (m[2] == "\n#") {
      m[2] = "\n";
      re.lastIndex--;
    }
    blocks.push( mk_block( m[1], m[2], line_no ) );
    line_no += count_lines( m[0] );
  }

  return blocks;
};

/**
 *  Markdown#processBlock( block, next ) -> undefined | [ JsonML, ... ]
 *  - block (String): the block to process
 *  - next (Array): the following blocks
 *
 * Process `block` and return an array of JsonML nodes representing `block`.
 *
 * It does this by asking each block level function in the dialect to process
 * the block until one can. Succesful handling is indicated by returning an
 * array (with zero or more JsonML nodes), failure by a false value.
 *
 * Blocks handlers are responsible for calling [[Markdown#processInline]]
 * themselves as appropriate.
 *
 * If the blocks were split incorrectly or adjacent blocks need collapsing you
 * can adjust `next` in place using shift/splice etc.
 *
 * If any of this default behaviour is not right for the dialect, you can
 * define a `__call__` method on the dialect that will get invoked to handle
 * the block processing.
 */
Markdown.prototype.processBlock = function processBlock( block, next ) {
  var cbs = this.dialect.block,
      ord = cbs.__order__;

  if ( "__call__" in cbs ) {
    return cbs.__call__.call(this, block, next);
  }

  for ( var i = 0; i < ord.length; i++ ) {
    //D:this.debug( "Testing", ord[i] );
    var res = cbs[ ord[i] ].call( this, block, next );
    if ( res ) {
      //D:this.debug("  matched");
      if ( !isArray(res) || ( res.length > 0 && !( isArray(res[0]) ) ) )
        this.debug(ord[i], "didn't return a proper array");
      //D:this.debug( "" );
      return res;
    }
  }

  // Uhoh! no match! Should we throw an error?
  return [];
};

Markdown.prototype.processInline = function processInline( block ) {
  return this.dialect.inline.__call__.call( this, String( block ) );
};

/**
 *  Markdown#toTree( source ) -> JsonML
 *  - source (String): markdown source to parse
 *
 *  Parse `source` into a JsonML tree representing the markdown document.
 **/
// custom_tree means set this.tree to `custom_tree` and restore old value on return
Markdown.prototype.toTree = function toTree( source, custom_root ) {
  var blocks = source instanceof Array ? source : this.split_blocks( source );

  // Make tree a member variable so its easier to mess with in extensions
  var old_tree = this.tree;
  try {
    this.tree = custom_root || this.tree || [ "markdown" ];

    blocks:
    while ( blocks.length ) {
      var b = this.processBlock( blocks.shift(), blocks );

      // Reference blocks and the like won't return any content
      if ( !b.length ) continue blocks;

      this.tree.push.apply( this.tree, b );
    }
    return this.tree;
  }
  finally {
    if ( custom_root ) {
      this.tree = old_tree;
    }
  }
};

// Noop by default
Markdown.prototype.debug = function () {
  var args = Array.prototype.slice.call( arguments);
  args.unshift(this.debug_indent);
  if ( typeof print !== "undefined" )
      print.apply( print, args );
  if ( typeof console !== "undefined" && typeof console.log !== "undefined" )
      console.log.apply( null, args );
}

Markdown.prototype.loop_re_over_block = function( re, block, cb ) {
  // Dont use /g regexps with this
  var m,
      b = block.valueOf();

  while ( b.length && (m = re.exec(b) ) != null ) {
    b = b.substr( m[0].length );
    cb.call(this, m);
  }
  return b;
};

/**
 * Markdown.dialects
 *
 * Namespace of built-in dialects.
 **/
Markdown.dialects = {};

/**
 * Markdown.dialects.Gruber
 *
 * The default dialect that follows the rules set out by John Gruber's
 * markdown.pl as closely as possible. Well actually we follow the behaviour of
 * that script which in some places is not exactly what the syntax web page
 * says.
 **/
Markdown.dialects.Gruber = {
  block: {
    atxHeader: function atxHeader( block, next ) {
      var m = block.match( /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/ );

      if ( !m ) return undefined;

      var header = [ "header", { level: m[ 1 ].length } ];
      Array.prototype.push.apply(header, this.processInline(m[ 2 ]));

      if ( m[0].length < block.length )
        next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

      return [ header ];
    },

    setextHeader: function setextHeader( block, next ) {
      var m = block.match( /^(.*)\n([-=])\2\2+(?:\n|$)/ );

      if ( !m ) return undefined;

      var level = ( m[ 2 ] === "=" ) ? 1 : 2;
      var header = [ "header", { level : level }, m[ 1 ] ];

      if ( m[0].length < block.length )
        next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

      return [ header ];
    },

    code: function code( block, next ) {
      // |    Foo
      // |bar
      // should be a code block followed by a paragraph. Fun
      //
      // There might also be adjacent code block to merge.

      var ret = [],
          re = /^(?: {0,3}\t| {4})(.*)\n?/,
          lines;

      // 4 spaces + content
      if ( !block.match( re ) ) return undefined;

      block_search:
      do {
        // Now pull out the rest of the lines
        var b = this.loop_re_over_block(
                  re, block.valueOf(), function( m ) { ret.push( m[1] ); } );

        if ( b.length ) {
          // Case alluded to in first comment. push it back on as a new block
          next.unshift( mk_block(b, block.trailing) );
          break block_search;
        }
        else if ( next.length ) {
          // Check the next block - it might be code too
          if ( !next[0].match( re ) ) break block_search;

          // Pull how how many blanks lines follow - minus two to account for .join
          ret.push ( block.trailing.replace(/[^\n]/g, "").substring(2) );

          block = next.shift();
        }
        else {
          break block_search;
        }
      } while ( true );

      return [ [ "code_block", ret.join("\n") ] ];
    },

    horizRule: function horizRule( block, next ) {
      // this needs to find any hr in the block to handle abutting blocks
      var m = block.match( /^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/ );

      if ( !m ) {
        return undefined;
      }

      var jsonml = [ [ "hr" ] ];

      // if there's a leading abutting block, process it
      if ( m[ 1 ] ) {
        jsonml.unshift.apply( jsonml, this.processBlock( m[ 1 ], [] ) );
      }

      // if there's a trailing abutting block, stick it into next
      if ( m[ 3 ] ) {
        next.unshift( mk_block( m[ 3 ] ) );
      }

      return jsonml;
    },

    // There are two types of lists. Tight and loose. Tight lists have no whitespace
    // between the items (and result in text just in the <li>) and loose lists,
    // which have an empty line between list items, resulting in (one or more)
    // paragraphs inside the <li>.
    //
    // There are all sorts weird edge cases about the original markdown.pl's
    // handling of lists:
    //
    // * Nested lists are supposed to be indented by four chars per level. But
    //   if they aren't, you can get a nested list by indenting by less than
    //   four so long as the indent doesn't match an indent of an existing list
    //   item in the 'nest stack'.
    //
    // * The type of the list (bullet or number) is controlled just by the
    //    first item at the indent. Subsequent changes are ignored unless they
    //    are for nested lists
    //
    lists: (function( ) {
      // Use a closure to hide a few variables.
      var any_list = "[*+-]|\\d+\\.",
          bullet_list = /[*+-]/,
          number_list = /\d+\./,
          // Capture leading indent as it matters for determining nested lists.
          is_list_re = new RegExp( "^( {0,3})(" + any_list + ")[ \t]+" ),
          indent_re = "(?: {0,3}\\t| {4})";

      // TODO: Cache this regexp for certain depths.
      // Create a regexp suitable for matching an li for a given stack depth
      function regex_for_depth( depth ) {

        return new RegExp(
          // m[1] = indent, m[2] = list_type
          "(?:^(" + indent_re + "{0," + depth + "} {0,3})(" + any_list + ")\\s+)|" +
          // m[3] = cont
          "(^" + indent_re + "{0," + (depth-1) + "}[ ]{0,4})"
        );
      }
      function expand_tab( input ) {
        return input.replace( / {0,3}\t/g, "    " );
      }

      // Add inline content `inline` to `li`. inline comes from processInline
      // so is an array of content
      function add(li, loose, inline, nl) {
        if ( loose ) {
          li.push( [ "para" ].concat(inline) );
          return;
        }
        // Hmmm, should this be any block level element or just paras?
        var add_to = li[li.length -1] instanceof Array && li[li.length - 1][0] == "para"
                   ? li[li.length -1]
                   : li;

        // If there is already some content in this list, add the new line in
        if ( nl && li.length > 1 ) inline.unshift(nl);

        for ( var i = 0; i < inline.length; i++ ) {
          var what = inline[i],
              is_str = typeof what == "string";
          if ( is_str && add_to.length > 1 && typeof add_to[add_to.length-1] == "string" ) {
            add_to[ add_to.length-1 ] += what;
          }
          else {
            add_to.push( what );
          }
        }
      }

      // contained means have an indent greater than the current one. On
      // *every* line in the block
      function get_contained_blocks( depth, blocks ) {

        var re = new RegExp( "^(" + indent_re + "{" + depth + "}.*?\\n?)*$" ),
            replace = new RegExp("^" + indent_re + "{" + depth + "}", "gm"),
            ret = [];

        while ( blocks.length > 0 ) {
          if ( re.exec( blocks[0] ) ) {
            var b = blocks.shift(),
                // Now remove that indent
                x = b.replace( replace, "");

            ret.push( mk_block( x, b.trailing, b.lineNumber ) );
          }
          else {
            break;
          }
        }
        return ret;
      }

      // passed to stack.forEach to turn list items up the stack into paras
      function paragraphify(s, i, stack) {
        var list = s.list;
        var last_li = list[list.length-1];

        if ( last_li[1] instanceof Array && last_li[1][0] == "para" ) {
          return;
        }
        if ( i + 1 == stack.length ) {
          // Last stack frame
          // Keep the same array, but replace the contents
          last_li.push( ["para"].concat( last_li.splice(1, last_li.length - 1) ) );
        }
        else {
          var sublist = last_li.pop();
          last_li.push( ["para"].concat( last_li.splice(1, last_li.length - 1) ), sublist );
        }
      }

      // The matcher function
      return function( block, next ) {
        var m = block.match( is_list_re );
        if ( !m ) return undefined;

        function make_list( m ) {
          var list = bullet_list.exec( m[2] )
                   ? ["bulletlist"]
                   : ["numberlist"];

          stack.push( { list: list, indent: m[1] } );
          return list;
        }


        var stack = [], // Stack of lists for nesting.
            list = make_list( m ),
            last_li,
            loose = false,
            ret = [ stack[0].list ],
            i;

        // Loop to search over block looking for inner block elements and loose lists
        loose_search:
        while ( true ) {
          // Split into lines preserving new lines at end of line
          var lines = block.split( /(?=\n)/ );

          // We have to grab all lines for a li and call processInline on them
          // once as there are some inline things that can span lines.
          var li_accumulate = "";

          // Loop over the lines in this block looking for tight lists.
          tight_search:
          for ( var line_no = 0; line_no < lines.length; line_no++ ) {
            var nl = "",
                l = lines[line_no].replace(/^\n/, function(n) { nl = n; return ""; });

            // TODO: really should cache this
            var line_re = regex_for_depth( stack.length );

            m = l.match( line_re );
            //print( "line:", uneval(l), "\nline match:", uneval(m) );

            // We have a list item
            if ( m[1] !== undefined ) {
              // Process the previous list item, if any
              if ( li_accumulate.length ) {
                add( last_li, loose, this.processInline( li_accumulate ), nl );
                // Loose mode will have been dealt with. Reset it
                loose = false;
                li_accumulate = "";
              }

              m[1] = expand_tab( m[1] );
              var wanted_depth = Math.floor(m[1].length/4)+1;
              //print( "want:", wanted_depth, "stack:", stack.length);
              if ( wanted_depth > stack.length ) {
                // Deep enough for a nested list outright
                //print ( "new nested list" );
                list = make_list( m );
                last_li.push( list );
                last_li = list[1] = [ "listitem" ];
              }
              else {
                // We aren't deep enough to be strictly a new level. This is
                // where Md.pl goes nuts. If the indent matches a level in the
                // stack, put it there, else put it one deeper then the
                // wanted_depth deserves.
                var found = false;
                for ( i = 0; i < stack.length; i++ ) {
                  if ( stack[ i ].indent != m[1] ) continue;
                  list = stack[ i ].list;
                  stack.splice( i+1, stack.length - (i+1) );
                  found = true;
                  break;
                }

                if (!found) {
                  //print("not found. l:", uneval(l));
                  wanted_depth++;
                  if ( wanted_depth <= stack.length ) {
                    stack.splice(wanted_depth, stack.length - wanted_depth);
                    //print("Desired depth now", wanted_depth, "stack:", stack.length);
                    list = stack[wanted_depth-1].list;
                    //print("list:", uneval(list) );
                  }
                  else {
                    //print ("made new stack for messy indent");
                    list = make_list(m);
                    last_li.push(list);
                  }
                }

                //print( uneval(list), "last", list === stack[stack.length-1].list );
                last_li = [ "listitem" ];
                list.push(last_li);
              } // end depth of shenegains
              nl = "";
            }

            // Add content
            if ( l.length > m[0].length ) {
              li_accumulate += nl + l.substr( m[0].length );
            }
          } // tight_search

          if ( li_accumulate.length ) {
            add( last_li, loose, this.processInline( li_accumulate ), nl );
            // Loose mode will have been dealt with. Reset it
            loose = false;
            li_accumulate = "";
          }

          // Look at the next block - we might have a loose list. Or an extra
          // paragraph for the current li
          var contained = get_contained_blocks( stack.length, next );

          // Deal with code blocks or properly nested lists
          if ( contained.length > 0 ) {
            // Make sure all listitems up the stack are paragraphs
            forEach( stack, paragraphify, this);

            last_li.push.apply( last_li, this.toTree( contained, [] ) );
          }

          var next_block = next[0] && next[0].valueOf() || "";

          if ( next_block.match(is_list_re) || next_block.match( /^ / ) ) {
            block = next.shift();

            // Check for an HR following a list: features/lists/hr_abutting
            var hr = this.dialect.block.horizRule( block, next );

            if ( hr ) {
              ret.push.apply(ret, hr);
              break;
            }

            // Make sure all listitems up the stack are paragraphs
            forEach( stack, paragraphify, this);

            loose = true;
            continue loose_search;
          }
          break;
        } // loose_search

        return ret;
      };
    })(),

    blockquote: function blockquote( block, next ) {
      if ( !block.match( /^>/m ) )
        return undefined;

      var jsonml = [];

      // separate out the leading abutting block, if any. I.e. in this case:
      //
      //  a
      //  > b
      //
      if ( block[ 0 ] != ">" ) {
        var lines = block.split( /\n/ ),
            prev = [],
            line_no = block.lineNumber;

        // keep shifting lines until you find a crotchet
        while ( lines.length && lines[ 0 ][ 0 ] != ">" ) {
            prev.push( lines.shift() );
            line_no++;
        }

        var abutting = mk_block( prev.join( "\n" ), "\n", block.lineNumber );
        jsonml.push.apply( jsonml, this.processBlock( abutting, [] ) );
        // reassemble new block of just block quotes!
        block = mk_block( lines.join( "\n" ), block.trailing, line_no );
      }


      // if the next block is also a blockquote merge it in
      while ( next.length && next[ 0 ][ 0 ] == ">" ) {
        var b = next.shift();
        block = mk_block( block + block.trailing + b, b.trailing, block.lineNumber );
      }

      // Strip off the leading "> " and re-process as a block.
      var input = block.replace( /^> ?/gm, "" ),
          old_tree = this.tree,
          processedBlock = this.toTree( input, [ "blockquote" ] ),
          attr = extract_attr( processedBlock );

      // If any link references were found get rid of them
      if ( attr && attr.references ) {
        delete attr.references;
        // And then remove the attribute object if it's empty
        if ( isEmpty( attr ) ) {
          processedBlock.splice( 1, 1 );
        }
      }

      jsonml.push( processedBlock );
      return jsonml;
    },

    referenceDefn: function referenceDefn( block, next) {
      var re = /^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/;
      // interesting matches are [ , ref_id, url, , title, title ]

      if ( !block.match(re) )
        return undefined;

      // make an attribute node if it doesn't exist
      if ( !extract_attr( this.tree ) ) {
        this.tree.splice( 1, 0, {} );
      }

      var attrs = extract_attr( this.tree );

      // make a references hash if it doesn't exist
      if ( attrs.references === undefined ) {
        attrs.references = {};
      }

      var b = this.loop_re_over_block(re, block, function( m ) {

        if ( m[2] && m[2][0] == "<" && m[2][m[2].length-1] == ">" )
          m[2] = m[2].substring( 1, m[2].length - 1 );

        var ref = attrs.references[ m[1].toLowerCase() ] = {
          href: m[2]
        };

        if ( m[4] !== undefined )
          ref.title = m[4];
        else if ( m[5] !== undefined )
          ref.title = m[5];

      } );

      if ( b.length )
        next.unshift( mk_block( b, block.trailing ) );

      return [];
    },

    para: function para( block, next ) {
      // everything's a para!
      return [ ["para"].concat( this.processInline( block ) ) ];
    }
  }
};

Markdown.dialects.Gruber.inline = {

    __oneElement__: function oneElement( text, patterns_or_re, previous_nodes ) {
      var m,
          res,
          lastIndex = 0;

      patterns_or_re = patterns_or_re || this.dialect.inline.__patterns__;
      var re = new RegExp( "([\\s\\S]*?)(" + (patterns_or_re.source || patterns_or_re) + ")" );

      m = re.exec( text );
      if (!m) {
        // Just boring text
        return [ text.length, text ];
      }
      else if ( m[1] ) {
        // Some un-interesting text matched. Return that first
        return [ m[1].length, m[1] ];
      }

      var res;
      if ( m[2] in this.dialect.inline ) {
        res = this.dialect.inline[ m[2] ].call(
                  this,
                  text.substr( m.index ), m, previous_nodes || [] );
      }
      // Default for now to make dev easier. just slurp special and output it.
      res = res || [ m[2].length, m[2] ];
      return res;
    },

    __call__: function inline( text, patterns ) {

      var out = [],
          res;

      function add(x) {
        //D:self.debug("  adding output", uneval(x));
        if ( typeof x == "string" && typeof out[out.length-1] == "string" )
          out[ out.length-1 ] += x;
        else
          out.push(x);
      }

      while ( text.length > 0 ) {
        res = this.dialect.inline.__oneElement__.call(this, text, patterns, out );
        text = text.substr( res.shift() );
        forEach(res, add )
      }

      return out;
    },

    // These characters are intersting elsewhere, so have rules for them so that
    // chunks of plain text blocks don't include them
    "]": function () {},
    "}": function () {},

    __escape__ : /^\\[\\`\*_{}\[\]()#\+.!\-]/,

    "\\": function escaped( text ) {
      // [ length of input processed, node/children to add... ]
      // Only esacape: \ ` * _ { } [ ] ( ) # * + - . !
      if ( this.dialect.inline.__escape__.exec( text ) )
        return [ 2, text.charAt( 1 ) ];
      else
        // Not an esacpe
        return [ 1, "\\" ];
    },

    "![": function image( text ) {

      // Unlike images, alt text is plain text only. no other elements are
      // allowed in there

      // ![Alt text](/path/to/img.jpg "Optional title")
      //      1          2            3       4         <--- captures
      var m = text.match( /^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/ );

      if ( m ) {
        if ( m[2] && m[2][0] == "<" && m[2][m[2].length-1] == ">" )
          m[2] = m[2].substring( 1, m[2].length - 1 );

        m[2] = this.dialect.inline.__call__.call( this, m[2], /\\/ )[0];

        var attrs = { alt: m[1], href: m[2] || "" };
        if ( m[4] !== undefined)
          attrs.title = m[4];

        return [ m[0].length, [ "img", attrs ] ];
      }

      // ![Alt text][id]
      m = text.match( /^!\[(.*?)\][ \t]*\[(.*?)\]/ );

      if ( m ) {
        // We can't check if the reference is known here as it likely wont be
        // found till after. Check it in md tree->hmtl tree conversion
        return [ m[0].length, [ "img_ref", { alt: m[1], ref: m[2].toLowerCase(), original: m[0] } ] ];
      }

      // Just consume the '!['
      return [ 2, "![" ];
    },

    "[": function link( text ) {

      var orig = String(text);
      // Inline content is possible inside `link text`
      var res = Markdown.DialectHelpers.inline_until_char.call( this, text.substr(1), "]" );

      // No closing ']' found. Just consume the [
      if ( !res ) return [ 1, "[" ];

      var consumed = 1 + res[ 0 ],
          children = res[ 1 ],
          link,
          attrs;

      // At this point the first [...] has been parsed. See what follows to find
      // out which kind of link we are (reference or direct url)
      text = text.substr( consumed );

      // [link text](/path/to/img.jpg "Optional title")
      //                 1            2       3         <--- captures
      // This will capture up to the last paren in the block. We then pull
      // back based on if there a matching ones in the url
      //    ([here](/url/(test))
      // The parens have to be balanced
      var m = text.match( /^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/ );
      if ( m ) {
        var url = m[1];
        consumed += m[0].length;

        if ( url && url[0] == "<" && url[url.length-1] == ">" )
          url = url.substring( 1, url.length - 1 );

        // If there is a title we don't have to worry about parens in the url
        if ( !m[3] ) {
          var open_parens = 1; // One open that isn't in the capture
          for ( var len = 0; len < url.length; len++ ) {
            switch ( url[len] ) {
            case "(":
              open_parens++;
              break;
            case ")":
              if ( --open_parens == 0) {
                consumed -= url.length - len;
                url = url.substring(0, len);
              }
              break;
            }
          }
        }

        // Process escapes only
        url = this.dialect.inline.__call__.call( this, url, /\\/ )[0];

        attrs = { href: url || "" };
        if ( m[3] !== undefined)
          attrs.title = m[3];

        link = [ "link", attrs ].concat( children );
        return [ consumed, link ];
      }

      // [Alt text][id]
      // [Alt text] [id]
      m = text.match( /^\s*\[(.*?)\]/ );

      if ( m ) {

        consumed += m[ 0 ].length;

        // [links][] uses links as its reference
        attrs = { ref: ( m[ 1 ] || String(children) ).toLowerCase(),  original: orig.substr( 0, consumed ) };

        link = [ "link_ref", attrs ].concat( children );

        // We can't check if the reference is known here as it likely wont be
        // found till after. Check it in md tree->hmtl tree conversion.
        // Store the original so that conversion can revert if the ref isn't found.
        return [ consumed, link ];
      }

      // [id]
      // Only if id is plain (no formatting.)
      if ( children.length == 1 && typeof children[0] == "string" ) {

        attrs = { ref: children[0].toLowerCase(),  original: orig.substr( 0, consumed ) };
        link = [ "link_ref", attrs, children[0] ];
        return [ consumed, link ];
      }

      // Just consume the "["
      return [ 1, "[" ];
    },


    "<": function autoLink( text ) {
      var m;

      if ( ( m = text.match( /^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/ ) ) != null ) {
        if ( m[3] ) {
          return [ m[0].length, [ "link", { href: "mailto:" + m[3] }, m[3] ] ];

        }
        else if ( m[2] == "mailto" ) {
          return [ m[0].length, [ "link", { href: m[1] }, m[1].substr("mailto:".length ) ] ];
        }
        else
          return [ m[0].length, [ "link", { href: m[1] }, m[1] ] ];
      }

      return [ 1, "<" ];
    },

    "`": function inlineCode( text ) {
      // Inline code block. as many backticks as you like to start it
      // Always skip over the opening ticks.
      var m = text.match( /(`+)(([\s\S]*?)\1)/ );

      if ( m && m[2] )
        return [ m[1].length + m[2].length, [ "inlinecode", m[3] ] ];
      else {
        // TODO: No matching end code found - warn!
        return [ 1, "`" ];
      }
    },

    "  \n": function lineBreak( text ) {
      return [ 3, [ "linebreak" ] ];
    }

};

// Meta Helper/generator method for em and strong handling
function strong_em( tag, md ) {

  var state_slot = tag + "_state",
      other_slot = tag == "strong" ? "em_state" : "strong_state";

  function CloseTag(len) {
    this.len_after = len;
    this.name = "close_" + md;
  }

  return function ( text, orig_match ) {

    if ( this[state_slot][0] == md ) {
      // Most recent em is of this type
      //D:this.debug("closing", md);
      this[state_slot].shift();

      // "Consume" everything to go back to the recrusion in the else-block below
      return[ text.length, new CloseTag(text.length-md.length) ];
    }
    else {
      // Store a clone of the em/strong states
      var other = this[other_slot].slice(),
          state = this[state_slot].slice();

      this[state_slot].unshift(md);

      //D:this.debug_indent += "  ";

      // Recurse
      var res = this.processInline( text.substr( md.length ) );
      //D:this.debug_indent = this.debug_indent.substr(2);

      var last = res[res.length - 1];

      //D:this.debug("processInline from", tag + ": ", uneval( res ) );

      var check = this[state_slot].shift();
      if ( last instanceof CloseTag ) {
        res.pop();
        // We matched! Huzzah.
        var consumed = text.length - last.len_after;
        return [ consumed, [ tag ].concat(res) ];
      }
      else {
        // Restore the state of the other kind. We might have mistakenly closed it.
        this[other_slot] = other;
        this[state_slot] = state;

        // We can't reuse the processed result as it could have wrong parsing contexts in it.
        return [ md.length, md ];
      }
    }
  }; // End returned function
}

Markdown.dialects.Gruber.inline["**"] = strong_em("strong", "**");
Markdown.dialects.Gruber.inline["__"] = strong_em("strong", "__");
Markdown.dialects.Gruber.inline["*"]  = strong_em("em", "*");
Markdown.dialects.Gruber.inline["_"]  = strong_em("em", "_");


// Build default order from insertion order.
Markdown.buildBlockOrder = function(d) {
  var ord = [];
  for ( var i in d ) {
    if ( i == "__order__" || i == "__call__" ) continue;
    ord.push( i );
  }
  d.__order__ = ord;
};

// Build patterns for inline matcher
Markdown.buildInlinePatterns = function(d) {
  var patterns = [];

  for ( var i in d ) {
    // __foo__ is reserved and not a pattern
    if ( i.match( /^__.*__$/) ) continue;
    var l = i.replace( /([\\.*+?|()\[\]{}])/g, "\\$1" )
             .replace( /\n/, "\\n" );
    patterns.push( i.length == 1 ? l : "(?:" + l + ")" );
  }

  patterns = patterns.join("|");
  d.__patterns__ = patterns;
  //print("patterns:", uneval( patterns ) );

  var fn = d.__call__;
  d.__call__ = function(text, pattern) {
    if ( pattern != undefined ) {
      return fn.call(this, text, pattern);
    }
    else
    {
      return fn.call(this, text, patterns);
    }
  };
};

Markdown.DialectHelpers = {};
Markdown.DialectHelpers.inline_until_char = function( text, want ) {
  var consumed = 0,
      nodes = [];

  while ( true ) {
    if ( text.charAt( consumed ) == want ) {
      // Found the character we were looking for
      consumed++;
      return [ consumed, nodes ];
    }

    if ( consumed >= text.length ) {
      // No closing char found. Abort.
      return null;
    }

    var res = this.dialect.inline.__oneElement__.call(this, text.substr( consumed ) );
    consumed += res[ 0 ];
    // Add any returned nodes.
    nodes.push.apply( nodes, res.slice( 1 ) );
  }
}

// Helper function to make sub-classing a dialect easier
Markdown.subclassDialect = function( d ) {
  function Block() {}
  Block.prototype = d.block;
  function Inline() {}
  Inline.prototype = d.inline;

  return { block: new Block(), inline: new Inline() };
};

Markdown.buildBlockOrder ( Markdown.dialects.Gruber.block );
Markdown.buildInlinePatterns( Markdown.dialects.Gruber.inline );

Markdown.dialects.Maruku = Markdown.subclassDialect( Markdown.dialects.Gruber );

Markdown.dialects.Maruku.processMetaHash = function processMetaHash( meta_string ) {
  var meta = split_meta_hash( meta_string ),
      attr = {};

  for ( var i = 0; i < meta.length; ++i ) {
    // id: #foo
    if ( /^#/.test( meta[ i ] ) ) {
      attr.id = meta[ i ].substring( 1 );
    }
    // class: .foo
    else if ( /^\./.test( meta[ i ] ) ) {
      // if class already exists, append the new one
      if ( attr["class"] ) {
        attr["class"] = attr["class"] + meta[ i ].replace( /./, " " );
      }
      else {
        attr["class"] = meta[ i ].substring( 1 );
      }
    }
    // attribute: foo=bar
    else if ( /\=/.test( meta[ i ] ) ) {
      var s = meta[ i ].split( /\=/ );
      attr[ s[ 0 ] ] = s[ 1 ];
    }
  }

  return attr;
}

function split_meta_hash( meta_string ) {
  var meta = meta_string.split( "" ),
      parts = [ "" ],
      in_quotes = false;

  while ( meta.length ) {
    var letter = meta.shift();
    switch ( letter ) {
      case " " :
        // if we're in a quoted section, keep it
        if ( in_quotes ) {
          parts[ parts.length - 1 ] += letter;
        }
        // otherwise make a new part
        else {
          parts.push( "" );
        }
        break;
      case "'" :
      case '"' :
        // reverse the quotes and move straight on
        in_quotes = !in_quotes;
        break;
      case "\\" :
        // shift off the next letter to be used straight away.
        // it was escaped so we'll keep it whatever it is
        letter = meta.shift();
      default :
        parts[ parts.length - 1 ] += letter;
        break;
    }
  }

  return parts;
}

Markdown.dialects.Maruku.block.document_meta = function document_meta( block, next ) {
  // we're only interested in the first block
  if ( block.lineNumber > 1 ) return undefined;

  // document_meta blocks consist of one or more lines of `Key: Value\n`
  if ( ! block.match( /^(?:\w+:.*\n)*\w+:.*$/ ) ) return undefined;

  // make an attribute node if it doesn't exist
  if ( !extract_attr( this.tree ) ) {
    this.tree.splice( 1, 0, {} );
  }

  var pairs = block.split( /\n/ );
  for ( p in pairs ) {
    var m = pairs[ p ].match( /(\w+):\s*(.*)$/ ),
        key = m[ 1 ].toLowerCase(),
        value = m[ 2 ];

    this.tree[ 1 ][ key ] = value;
  }

  // document_meta produces no content!
  return [];
};

Markdown.dialects.Maruku.block.block_meta = function block_meta( block, next ) {
  // check if the last line of the block is an meta hash
  var m = block.match( /(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/ );
  if ( !m ) return undefined;

  // process the meta hash
  var attr = this.dialect.processMetaHash( m[ 2 ] );

  var hash;

  // if we matched ^ then we need to apply meta to the previous block
  if ( m[ 1 ] === "" ) {
    var node = this.tree[ this.tree.length - 1 ];
    hash = extract_attr( node );

    // if the node is a string (rather than JsonML), bail
    if ( typeof node === "string" ) return undefined;

    // create the attribute hash if it doesn't exist
    if ( !hash ) {
      hash = {};
      node.splice( 1, 0, hash );
    }

    // add the attributes in
    for ( a in attr ) {
      hash[ a ] = attr[ a ];
    }

    // return nothing so the meta hash is removed
    return [];
  }

  // pull the meta hash off the block and process what's left
  var b = block.replace( /\n.*$/, "" ),
      result = this.processBlock( b, [] );

  // get or make the attributes hash
  hash = extract_attr( result[ 0 ] );
  if ( !hash ) {
    hash = {};
    result[ 0 ].splice( 1, 0, hash );
  }

  // attach the attributes to the block
  for ( a in attr ) {
    hash[ a ] = attr[ a ];
  }

  return result;
};

Markdown.dialects.Maruku.block.definition_list = function definition_list( block, next ) {
  // one or more terms followed by one or more definitions, in a single block
  var tight = /^((?:[^\s:].*\n)+):\s+([\s\S]+)$/,
      list = [ "dl" ],
      i, m;

  // see if we're dealing with a tight or loose block
  if ( ( m = block.match( tight ) ) ) {
    // pull subsequent tight DL blocks out of `next`
    var blocks = [ block ];
    while ( next.length && tight.exec( next[ 0 ] ) ) {
      blocks.push( next.shift() );
    }

    for ( var b = 0; b < blocks.length; ++b ) {
      var m = blocks[ b ].match( tight ),
          terms = m[ 1 ].replace( /\n$/, "" ).split( /\n/ ),
          defns = m[ 2 ].split( /\n:\s+/ );

      // print( uneval( m ) );

      for ( i = 0; i < terms.length; ++i ) {
        list.push( [ "dt", terms[ i ] ] );
      }

      for ( i = 0; i < defns.length; ++i ) {
        // run inline processing over the definition
        list.push( [ "dd" ].concat( this.processInline( defns[ i ].replace( /(\n)\s+/, "$1" ) ) ) );
      }
    }
  }
  else {
    return undefined;
  }

  return [ list ];
};

// splits on unescaped instances of @ch. If @ch is not a character the result
// can be unpredictable

Markdown.dialects.Maruku.block.table = function table (block, next) {

    var _split_on_unescaped = function(s, ch) {
        ch = ch || '\\s';
        if (ch.match(/^[\\|\[\]{}?*.+^$]$/)) { ch = '\\' + ch; }
        var res = [ ],
            r = new RegExp('^((?:\\\\.|[^\\\\' + ch + '])*)' + ch + '(.*)'),
            m;
        while(m = s.match(r)) {
            res.push(m[1]);
            s = m[2];
        }
        res.push(s);
        return res;
    }

    var leading_pipe = /^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,
        // find at least an unescaped pipe in each line
        no_leading_pipe = /^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/,
        i, m;
    if (m = block.match(leading_pipe)) {
        // remove leading pipes in contents
        // (header and horizontal rule already have the leading pipe left out)
        m[3] = m[3].replace(/^\s*\|/gm, '');
    } else if (! ( m = block.match(no_leading_pipe))) {
        return undefined;
    }

    var table = [ "table", [ "thead", [ "tr" ] ], [ "tbody" ] ];

    // remove trailing pipes, then split on pipes
    // (no escaped pipes are allowed in horizontal rule)
    m[2] = m[2].replace(/\|\s*$/, '').split('|');

    // process alignment
    var html_attrs = [ ];
    forEach (m[2], function (s) {
        if (s.match(/^\s*-+:\s*$/))       html_attrs.push({align: "right"});
        else if (s.match(/^\s*:-+\s*$/))  html_attrs.push({align: "left"});
        else if (s.match(/^\s*:-+:\s*$/)) html_attrs.push({align: "center"});
        else                              html_attrs.push({});
    });

    // now for the header, avoid escaped pipes
    m[1] = _split_on_unescaped(m[1].replace(/\|\s*$/, ''), '|');
    for (i = 0; i < m[1].length; i++) {
        table[1][1].push(['th', html_attrs[i] || {}].concat(
            this.processInline(m[1][i].trim())));
    }

    // now for body contents
    forEach (m[3].replace(/\|\s*$/mg, '').split('\n'), function (row) {
        var html_row = ['tr'];
        row = _split_on_unescaped(row, '|');
        for (i = 0; i < row.length; i++) {
            html_row.push(['td', html_attrs[i] || {}].concat(this.processInline(row[i].trim())));
        }
        table[2].push(html_row);
    }, this);

    return [table];
}

Markdown.dialects.Maruku.inline[ "{:" ] = function inline_meta( text, matches, out ) {
  if ( !out.length ) {
    return [ 2, "{:" ];
  }

  // get the preceeding element
  var before = out[ out.length - 1 ];

  if ( typeof before === "string" ) {
    return [ 2, "{:" ];
  }

  // match a meta hash
  var m = text.match( /^\{:\s*((?:\\\}|[^\}])*)\s*\}/ );

  // no match, false alarm
  if ( !m ) {
    return [ 2, "{:" ];
  }

  // attach the attributes to the preceeding element
  var meta = this.dialect.processMetaHash( m[ 1 ] ),
      attr = extract_attr( before );

  if ( !attr ) {
    attr = {};
    before.splice( 1, 0, attr );
  }

  for ( var k in meta ) {
    attr[ k ] = meta[ k ];
  }

  // cut out the string and replace it with nothing
  return [ m[ 0 ].length, "" ];
};

Markdown.dialects.Maruku.inline.__escape__ = /^\\[\\`\*_{}\[\]()#\+.!\-|:]/;

Markdown.buildBlockOrder ( Markdown.dialects.Maruku.block );
Markdown.buildInlinePatterns( Markdown.dialects.Maruku.inline );

var isArray = Array.isArray || function(obj) {
  return Object.prototype.toString.call(obj) == "[object Array]";
};

var forEach;
// Don't mess with Array.prototype. Its not friendly
if ( Array.prototype.forEach ) {
  forEach = function( arr, cb, thisp ) {
    return arr.forEach( cb, thisp );
  };
}
else {
  forEach = function(arr, cb, thisp) {
    for (var i = 0; i < arr.length; i++) {
      cb.call(thisp || arr, arr[i], i, arr);
    }
  }
}

var isEmpty = function( obj ) {
  for ( var key in obj ) {
    if ( hasOwnProperty.call( obj, key ) ) {
      return false;
    }
  }

  return true;
}

function extract_attr( jsonml ) {
  return isArray(jsonml)
      && jsonml.length > 1
      && typeof jsonml[ 1 ] === "object"
      && !( isArray(jsonml[ 1 ]) )
      ? jsonml[ 1 ]
      : undefined;
}



/**
 *  renderJsonML( jsonml[, options] ) -> String
 *  - jsonml (Array): JsonML array to render to XML
 *  - options (Object): options
 *
 *  Converts the given JsonML into well-formed XML.
 *
 *  The options currently understood are:
 *
 *  - root (Boolean): wether or not the root node should be included in the
 *    output, or just its children. The default `false` is to not include the
 *    root itself.
 */
expose.renderJsonML = function( jsonml, options ) {
  options = options || {};
  // include the root element in the rendered output?
  options.root = options.root || false;

  var content = [];

  if ( options.root ) {
    content.push( render_tree( jsonml ) );
  }
  else {
    jsonml.shift(); // get rid of the tag
    if ( jsonml.length && typeof jsonml[ 0 ] === "object" && !( jsonml[ 0 ] instanceof Array ) ) {
      jsonml.shift(); // get rid of the attributes
    }

    while ( jsonml.length ) {
      content.push( render_tree( jsonml.shift() ) );
    }
  }

  return content.join( "\n\n" );
};

function escapeHTML( text ) {
  return text.replace( /&/g, "&amp;" )
             .replace( /</g, "&lt;" )
             .replace( />/g, "&gt;" )
             .replace( /"/g, "&quot;" )
             .replace( /'/g, "&#39;" );
}

function render_tree( jsonml ) {
  // basic case
  if ( typeof jsonml === "string" ) {
    return escapeHTML( jsonml );
  }

  var tag = jsonml.shift(),
      attributes = {},
      content = [];

  if ( jsonml.length && typeof jsonml[ 0 ] === "object" && !( jsonml[ 0 ] instanceof Array ) ) {
    attributes = jsonml.shift();
  }

  while ( jsonml.length ) {
    content.push( render_tree( jsonml.shift() ) );
  }

  var tag_attrs = "";
  for ( var a in attributes ) {
    tag_attrs += " " + a + '="' + escapeHTML( attributes[ a ] ) + '"';
  }

  // be careful about adding whitespace here for inline elements
  if ( tag == "img" || tag == "br" || tag == "hr" ) {
    return "<"+ tag + tag_attrs + "/>";
  }
  else {
    return "<"+ tag + tag_attrs + ">" + content.join( "" ) + "</" + tag + ">";
  }
}

function convert_tree_to_html( tree, references, options ) {
  var i;
  options = options || {};

  // shallow clone
  var jsonml = tree.slice( 0 );

  if ( typeof options.preprocessTreeNode === "function" ) {
      jsonml = options.preprocessTreeNode(jsonml, references);
  }

  // Clone attributes if they exist
  var attrs = extract_attr( jsonml );
  if ( attrs ) {
    jsonml[ 1 ] = {};
    for ( i in attrs ) {
      jsonml[ 1 ][ i ] = attrs[ i ];
    }
    attrs = jsonml[ 1 ];
  }

  // basic case
  if ( typeof jsonml === "string" ) {
    return jsonml;
  }

  // convert this node
  switch ( jsonml[ 0 ] ) {
    case "header":
      jsonml[ 0 ] = "h" + jsonml[ 1 ].level;
      delete jsonml[ 1 ].level;
      break;
    case "bulletlist":
      jsonml[ 0 ] = "ul";
      break;
    case "numberlist":
      jsonml[ 0 ] = "ol";
      break;
    case "listitem":
      jsonml[ 0 ] = "li";
      break;
    case "para":
      jsonml[ 0 ] = "p";
      break;
    case "markdown":
      jsonml[ 0 ] = "html";
      if ( attrs ) delete attrs.references;
      break;
    case "code_block":
      jsonml[ 0 ] = "pre";
      i = attrs ? 2 : 1;
      var code = [ "code" ];
      code.push.apply( code, jsonml.splice( i, jsonml.length - i ) );
      jsonml[ i ] = code;
      break;
    case "inlinecode":
      jsonml[ 0 ] = "code";
      break;
    case "img":
      jsonml[ 1 ].src = jsonml[ 1 ].href;
      delete jsonml[ 1 ].href;
      break;
    case "linebreak":
      jsonml[ 0 ] = "br";
    break;
    case "link":
      jsonml[ 0 ] = "a";
      break;
    case "link_ref":
      jsonml[ 0 ] = "a";

      // grab this ref and clean up the attribute node
      var ref = references[ attrs.ref ];

      // if the reference exists, make the link
      if ( ref ) {
        delete attrs.ref;

        // add in the href and title, if present
        attrs.href = ref.href;
        if ( ref.title ) {
          attrs.title = ref.title;
        }

        // get rid of the unneeded original text
        delete attrs.original;
      }
      // the reference doesn't exist, so revert to plain text
      else {
        return attrs.original;
      }
      break;
    case "img_ref":
      jsonml[ 0 ] = "img";

      // grab this ref and clean up the attribute node
      var ref = references[ attrs.ref ];

      // if the reference exists, make the link
      if ( ref ) {
        delete attrs.ref;

        // add in the href and title, if present
        attrs.src = ref.href;
        if ( ref.title ) {
          attrs.title = ref.title;
        }

        // get rid of the unneeded original text
        delete attrs.original;
      }
      // the reference doesn't exist, so revert to plain text
      else {
        return attrs.original;
      }
      break;
  }

  // convert all the children
  i = 1;

  // deal with the attribute node, if it exists
  if ( attrs ) {
    // if there are keys, skip over it
    for ( var key in jsonml[ 1 ] ) {
        i = 2;
        break;
    }
    // if there aren't, remove it
    if ( i === 1 ) {
      jsonml.splice( i, 1 );
    }
  }

  for ( ; i < jsonml.length; ++i ) {
    jsonml[ i ] = convert_tree_to_html( jsonml[ i ], references, options );
  }

  return jsonml;
}


// merges adjacent text nodes into a single node
function merge_text_nodes( jsonml ) {
  // skip the tag name and attribute hash
  var i = extract_attr( jsonml ) ? 2 : 1;

  while ( i < jsonml.length ) {
    // if it's a string check the next item too
    if ( typeof jsonml[ i ] === "string" ) {
      if ( i + 1 < jsonml.length && typeof jsonml[ i + 1 ] === "string" ) {
        // merge the second string into the first and remove it
        jsonml[ i ] += jsonml.splice( i + 1, 1 )[ 0 ];
      }
      else {
        ++i;
      }
    }
    // if it's not a string recurse
    else {
      merge_text_nodes( jsonml[ i ] );
      ++i;
    }
  }
}

} )( (function() {
  if ( typeof exports === "undefined" ) {
    window.markdown = {};
    return window.markdown;
  }
  else {
    return exports;
  }
} )() );

define("markdown", function(){});

define('js/data',["angular",
        "giotto",
        "markdown"], function (angular, d3) {
    //
    // Enable debug if needed
    d3.utils.logger().debugEnabled(true);
    //
    // Expose functions used in examples
    angular.module('giottojs.data', [])

        .run(['$rootScope', (scope) => {
            scope.d3 = d3;
            d3.examples = {};
            var examples = d3.examples;

            examples.simpleBarChart = simpleBarChart;
        }])
        //
        // JSON representation of giotto default options
        .directive('giottoOptions', ['$window', function ($window) {

            return {
                restrict: 'AE',
                link: function (scope, element, attrs) {
                    var key = attrs.giottoOptions,
                        data = d3.defaults;
                    if (key) data = data[key];

                    var df = angular.toJson(data, 4).split('\n');
                    df = df.map(function (v) {
                        return '    ' + v;
                    }).join('\n');
                    element.html($window.markdown.toHTML(df));
                }
            };
        }])

        .controller('GiottoTools', ['$scope', function (scope) {
            var vm = this;

            vm.randomize = function () {
                var gt = scope.gt;
                if (gt) {
                    gt.broadcast('draw');
                    gt.data.load();
                }
            };
        }]);


    function simpleBarChart () {
        return d3.array.range(-5, 5, 0.5).map((x) => {
            return [x, 1/(1+Math.exp(-x)) - 0.5];
        });
    }

});

require([
    'js/require.config',
    'giotto'], function (lux, d3) {


    d3.data.addProvider('quandl', quandl);

    var quandlUrl = 'https://www.quandl.com/api/v3/datasets/',
        authToken = 'v3ebx8S9fs6aSWr473av';

    function quandl(expr, opts) {
        var self = this,
            format = opts.format || 'csv',
            window = opts.window,
            url = quandlUrl + expr + '.' + format + '?' + authToken,
            loader = d3.request[format];

        if (window) {
            var d = d3.time.timeDay,
                today = d.round(new Date),
                start = d.offset(today, -d3.quant.period(window).totalDays);
            url += '&start_date=' + d3.timeFormat.isoFormat(start);
        }

        if (!loader) throw new Error('Cannot load ' + format);

        loader(url, function (error, data) {
            if (error)
                throw new Error(error);
            self.ready(data, expr, opts);
        });
    }

});

define("js/quandl", function(){});

require([
    'js/require.config',
    'giotto'], function (lux, d3) {


    d3.data.addProvider('eurostat', eurostat);

    var baseUrl = 'http://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/';

    function eurostat(expr, opts) {
        var self = this,
            url = baseUrl + expr + '?',
            clean = opts.clean;

        delete opts.clean;

        d3.quant.forEach(opts, function (value, key) {
            if (key !== 'eurostat') {
                if (!d3.quant.isArray(value)) value = [value];
                value.forEach(function (v) {
                    if (url[url.length - 1] != '?') url += '&';
                    url += key + '=' + v;
                });
            }
        });

        d3.request.json(url, function (error, data) {
            if (error)
                throw new Error(error);
            var serie = d3.quant.jsonStat(data, {crossfilter: true, clean: clean});

            self.ready(serie.data(), expr, opts);
        });
    }

});

define("js/eurostat", function(){});

/* eslint-plugin-disable angular */
define('lux/core/utils',['angular',
        'lux/config/main'], function (angular, lux) {
    'use strict';

    var root = lux.root,
        forEach = angular.forEach,
        slice = Array.prototype.slice,
        generateCallbacks = function () {
            var callbackFunctions = [],
                callFunctions = function () {
                    var self = this,
                        args = slice.call(arguments, 0);
                    callbackFunctions.forEach(function (f) {
                        f.apply(self, args);
                    });
                };
            //
            callFunctions.add = function (f) {
                callbackFunctions.push(f);
            };
            return callFunctions;
        };
    //
    // Add a callback for an event to an element
    lux.addEvent = function (element, event, callback) {
        var handler = element[event];
        if (!handler)
            element[event] = handler = generateCallbacks();
        if (handler.add)
            handler.add(callback);
    };
    //
    lux.windowResize = function (callback) {
        lux.addEvent(window, 'onresize', callback);
    };
    //
    lux.windowHeight = function () {
        return window.innerHeight > 0 ? window.innerHeight : screen.availHeight;
    };
    //
    lux.isAbsolute = new RegExp('^([a-z]+://|//)');
    //
    // Check if element has tagName tag
    lux.isTag = function (element, tag) {
        element = angular.element(element);
        return element.length === 1 && element[0].tagName === tag.toUpperCase();
    };
    //
    lux.joinUrl = function () {
        var bit, url = '';
        for (var i = 0; i < arguments.length; ++i) {
            bit = arguments[i];
            if (bit) {
                var cbit = bit,
                    slash = false;
                // remove front slashes if cbit has some
                while (url && cbit.substring(0, 1) === '/')
                    cbit = cbit.substring(1);
                // remove end slashes
                while (cbit.substring(cbit.length - 1) === '/') {
                    slash = true;
                    cbit = cbit.substring(0, cbit.length - 1);
                }
                if (cbit) {
                    if (url && url.substring(url.length - 1) !== '/')
                        url += '/';
                    url += cbit;
                    if (slash)
                        url += '/';
                }
            }
        }
        return url;
    };
    //
    //  getOPtions
    //  ===============
    //
    //  Retrive options for the ``options`` string in ``attrs`` if available.
    //  Used by directive when needing to specify options in javascript rather
    //  than html data attributes.
    lux.getOptions = function (attrs, optionName) {
        var options;
        if (attrs) {
            if (optionName) options = attrs[optionName];
            if (!options) {
                optionName = 'options';
                options = attrs[optionName];
            }
            if (angular.isString(options))
                options = getAttribute(root, options);
            if (angular.isFunction(options))
                options = options();
        }
        if (!options) options = {};
        if (lux.isObject(options))
            angular.forEach(attrs, function (value, name) {
                if (name.substring(0, 1) !== '$' && name !== optionName)
                    options[name] = value;
            });

        return options;
    };
    //
    // random generated numbers for a uuid
    lux.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    //
    // Extend the initial array with values for other arrays
    lux.extendArray = function () {
        if (!arguments.length) return;
        var value = arguments[0],
            push = function (v) {
                value.push(v);
            };
        if (typeof(value.push) === 'function') {
            for (var i = 1; i < arguments.length; ++i)
                forEach(arguments[i], push);
        }
        return value;
    };
    //
    //  querySelector
    //  ===================
    //
    //  Simple wrapper for a querySelector
    lux.querySelector = function (elem, query) {
        if (arguments.length === 1 && lux.isString(elem)) {
            query = elem;
            elem = document;
        }
        elem = angular.element(elem);
        if (elem.length && query)
            return angular.element(elem[0].querySelector(query));
        else
            return elem;
    };
    //
    //    LoadCss
    //  =======================
    //
    //  Load a style sheet link
    var loadedCss = {};
    //
    lux.loadCss = function (filename) {
        if (!loadedCss[filename]) {
            loadedCss[filename] = true;
            var fileref = document.createElement('link');
            fileref.setAttribute('rel', 'stylesheet');
            fileref.setAttribute('type', 'text/css');
            fileref.setAttribute('href', filename);
            document.getElementsByTagName('head')[0].appendChild(fileref);
        }
    };
    //
    //
    lux.globalEval = function (data) {
        if (data) {
            // We use execScript on Internet Explorer
            // We use an anonymous function so that context is window
            // rather than jQuery in Firefox
            (root.execScript || function (data) {
                root['eval'].call(root, data);
            })(data);
        }
    };
    //
    // Simple Slugify function
    lux.slugify = function (str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
        var to = 'aaaaeeeeiiiioooouuuunc------';
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    };
    //
    lux.now = function () {
        return Date.now ? Date.now() : new Date().getTime();
    };
//
    lux.size = function (o) {
        if (!o) return 0;
        if (o.length !== undefined) return o.length;
        var n = 0;
        forEach(o, function () {
            ++n;
        });
        return n;
    };
    //
    // Used by the getObject function
    function getAttribute (obj, name) {
        var bits = name.split('.');

        for (var i = 0; i < bits.length; ++i) {
            obj = obj[bits[i]];
            if (!obj) break;
        }
        if (typeof obj === 'function')
            obj = obj();

        return obj;
    }
    //
    //
    //  Get Options
    //  ==============================================
    //
    //  Obtain an object from scope (if available) with fallback to
    //  the global javascript object
    lux.getObject = function (attrs, name, scope) {
        var key = attrs[name],
            exclude = [name, 'class', 'style'],
            options;

        if (key) {
            // Try the scope first
            if (scope) options = getAttribute(scope, key);

            if (!options) options = getAttribute(root, key);
        }
        if (!options) options = {};

        forEach(attrs, function (value, name) {
            if (name.substring(0, 1) !== '$' && exclude.indexOf(name) === -1)
                options[name] = value;
        });
        return options;
    };

    /**
     * Formats a string (using simple substitution)
     * @param   {String}    str         e.g. 'Hello {name}!'
     * @param   {Object}    values      e.g. {name: 'King George III'}
     * @returns {String}                e.g. 'Hello King George III!'
     */
    lux.formatString = function (str, values) {
        return str.replace(/{(\w+)}/g, function (match, placeholder) {
            return values.hasOwnProperty(placeholder) ? values[placeholder] : '';
        });
    };
    //
    //  Capitalize the first letter of string
    lux.capitalize = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    /**
     * Obtain a JSON object from a string (if available) otherwise null
     *
     * @param {string}
     * @returns {object} json object
     */
    lux.getJsonOrNone = function (str) {
        try {
            return JSON.parse(str);
        } catch (error) {
            return null;
        }
    };

    /**
     * Checks if a JSON value can be stringify
     *
     * @param {value} json value
     * @returns {boolean}
     */
    lux.isJsonStringify = function (value) {
        if (lux.isObject(value) || lux.isArray(value) || lux.isString(value))
            return true;
        return false;
    };

    // Hack for delaying with ui-router state.href
    // TODO: fix this!
    lux.stateHref = function (state, State, Params) {
        if (Params) {
            var url = state.href(State, Params);
            return url.replace(/%2F/g, '/');
        } else {
            return state.href(State);
        }
    };

    return lux;
});

define('lux/core/message',['lux/config/main'], function (lux) {
    'use strict';

    function asMessage(level, message) {
        if (lux.isString(message)) message = {text: message};
        message.type = level;
        return message;
    }

    lux.messageService = {
        pushMessage: function () {
        },

        debug: function (text) {
            this.pushMessage(asMessage('debug', text));
        },

        info: function (text) {
            this.pushMessage(asMessage('info', text));
        },

        success: function (text) {
            this.pushMessage(asMessage('success', text));
        },

        warn: function (text) {
            this.pushMessage(asMessage('warn', text));
        },

        error: function (text) {
            this.pushMessage(asMessage('error', text));
        },

        log: function ($log, message) {
            var type = message.type;
            if (type === 'success') type = 'info';
            $log[type](message.text);
        }
    };

    lux.messages = lux.extend(lux.messages);

    return lux.messageService;
});

define('lux/core/api',['angular',
        'lux/config/main'], function (angular, lux) {
    'use strict';

    var extend = angular.extend;

    lux.messages.no_api = function (url) {
        return {
            text: 'Api client for "' + url + '" is not available',
            icon: 'fa fa-exclamation-triangle'
        };
    };

    //  Lux Api service
    //	===================
    //
    //	A factory of javascript clients to web services
    angular.module('lux.services', [])
        //
        .constant('loginUrl', lux.context.LOGIN_URL || '')
        //
        .constant('postLoginUrl', lux.context.POST_LOGIN_URL || '/')
        // Registered api
        .value('ApiTypes', {})
        //
        .value('AuthApis', {})
        //
        .run(['$window', '$lux', function ($window, $lux) {
            //
            var doc = $window.document,
                name = angular.element(doc.querySelector('meta[name=csrf-param]')).attr('content'),
                csrf_token = angular.element(doc.querySelector('meta[name=csrf-token]')).attr('content');

            $lux.user_token = angular.element(doc.querySelector('meta[name=user-token]')).attr('content');

            if (name && csrf_token) {
                $lux.csrf = {};
                $lux.csrf[name] = csrf_token;
            }
        }])
        //
        .factory('luxHttpPromise', [function () {
            //
            return _luxHttpPromise();
        }])
        //
        .factory('$lux', ['$location', '$window', '$q', '$http', '$log',
            '$timeout', 'ApiTypes', 'AuthApis', '$templateCache', '$compile',
            '$rootScope', 'luxHttpPromise',
            function ($location, $window, $q, $http, $log, $timeout,
                      ApiTypes, AuthApis, $templateCache, $compile,
                      $scope, luxHttpPromise) {

                var $lux = {
                    location: $location,
                    window: $window,
                    log: $log,
                    http: $http,
                    q: $q,
                    timeout: $timeout,
                    templateCache: $templateCache,
                    compile: $compile,
                    apiUrls: {},
                    promise: luxHttpPromise,
                    api: api,
                    authApi: authApi,
                    formData: formData,
                    renderTemplate: renderTemplate,
                    messages: extend({}, lux.messageService, {
                        pushMessage: function (message) {
                            this.log($log, message);
                            $scope.$broadcast('messageAdded', message);
                        }
                    })
                };
                return $lux;
                //  Create a client api
                //  -------------------------
                //
                //  context: an api name or an object containing, name, url and type.
                //
                //  name: the api name
                //  url: the api base url
                //  type: optional api type (default is ``lux``)
                function api (url, api) {
                    if (arguments.length === 1) {
                        var defaults;
                        if (angular.isObject(url)) {
                            defaults = url;
                            url = url.url;
                        }
                        api = ApiTypes[url];
                        if (!api)
                            $lux.messages.error(lux.messages.no_api(url));
                        else
                            return api(url, this).defaults(defaults);
                    } else if (arguments.length === 2) {
                        ApiTypes[url] = api;
                        return api(url, this);
                    }
                }

                //
                // Set/get the authentication handler for a given api
                function authApi (api, auth) {
                    if (arguments.length === 1)
                        return AuthApis[api.baseUrl()];
                    else if (arguments.length === 2)
                        AuthApis[api.baseUrl()] = auth;
                }

                //
                // Change the form data depending on content type
                function formData (contentType) {

                    return function (data) {
                        data = extend(data || {}, $lux.csrf);
                        if (contentType === 'application/x-www-form-urlencoded')
                            return angular.element.param(data);
                        else if (contentType === 'multipart/form-data') {
                            var fd = new FormData();
                            angular.forEach(data, function (value, key) {
                                fd.append(key, value);
                            });
                            return fd;
                        } else {
                            return angular.toJson(data);
                        }
                    };
                }
                //
                // Render a template from a url
                function renderTemplate (url, element, scope, callback) {
                    var template = $templateCache.get(url);
                    if (!template) {
                        $http.get(url).then(function (resp) {
                            template = resp.data;
                            $templateCache.put(url, template);
                            _render(element, template, scope, callback);
                        }, function () {
                            $lux.messages.error('Could not load template from ' + url);
                        });
                    } else
                        _render(element, template, scope, callback);
                }

                function _render(element, template, scope, callback) {
                    var elem = $compile(template)(scope);
                    element.append(elem);
                    if (callback) callback(elem);
                }
            }]);

    var ENCODE_URL_METHODS = ['delete', 'get', 'head', 'options'];
    //
    //  Lux API Interface for REST
    //
    lux.apiFactory = function (url, $lux) {
        //
        //  Object containing the urls for the api.
        var api = {},
            defaults = {};

        api.toString = function () {
            if (defaults.name)
                return lux.joinUrl(api.baseUrl(), defaults.name);
            else
                return api.baseUrl();
        };
        //
        // Get/Set defaults options for requests
        api.defaults = function (_) {
            if (!arguments.length) return defaults;
            if (_)
                defaults = _;
            return api;
        };

        api.formReady = function () {
            $lux.log.error('Cannot handle form ready');
        };
        //
        // API base url
        api.baseUrl = function () {
            return url;
        };
        //
        api.get = function (opts, data) {
            return api.request('get', opts, data);
        };
        //
        api.post = function (opts, data) {
            return api.request('post', opts, data);
        };
        //
        api.put = function (opts, data) {
            return api.request('put', opts, data);
        };
        //
        api.head = function (opts, data) {
            return api.request('head', opts, data);
        };
        //
        api.delete = function (opts, data) {
            return api.request('delete', opts, data);
        };
        //
        //  Add additional Http options to the request
        api.httpOptions = function () {
        };
        //
        //  This function can be used to add authentication
        api.authentication = function () {
        };
        //
        //  Return the current user
        //  ---------------------------
        //
        //  Only implemented by apis managing authentication
        api.user = function () {
        };
        //
        // Perform the actual request and return a promise
        //	method: HTTP method
        //  opts: request options to override defaults
        //	data: body or url data
        api.request = function (method, opts, data) {
            // handle urlparams when not an object
            var o = extend({}, api.defaults());
            o.method = method.toLowerCase();
            if (ENCODE_URL_METHODS.indexOf(o.method) === -1) {
                o.data = data;
            } else {
                if (!angular.isObject(o.params)) {
                    o.params = {};
                }
                extend(o.params, data || {});
            }

            opts = extend(o, opts);

            var d = $lux.q.defer(),
            //
                request = {
                    name: opts.name,
                    //
                    deferred: d,
                    //
                    on: $lux.promise(d.promise, opts),
                    //
                    options: opts,
                    //
                    error: function (response) {
                        if (angular.isString(response.data))
                            response.data = {error: true, message: data};
                        d.reject(response);
                    },
                    //
                    success: function (response) {
                        if (angular.isString(response.data))
                            response.data = {message: data};

                        if (!response.data || response.data.error)
                            d.reject(response);
                        else
                            d.resolve(response);
                    }
                };
            //
            delete opts.name;
            if (opts.url === api.baseUrl())
                delete opts.url;
            //
            sendRequest(request);
            //
            return request.on;
        };

        /**
         * Populates $lux.apiUrls for an API URL.
         *
         * @returns      promise
         */
        api.populateApiUrls = function () {
            $lux.log.info('Fetching api info');
            return $lux.http.get(url).then(function (resp) {
                $lux.apiUrls[url] = resp.data;
                return resp.data;
            });
        };

        /**
         * Gets API endpoint URLs from root URL
         *
         * @returns     promise, resolved when API URLs available
         */
        api.getApiNames = function () {
            var promise, deferred;
            if (!angular.isObject($lux.apiUrls[url])) {
                promise = api.populateApiUrls();
            } else {
                deferred = $lux.q.defer();
                promise = deferred.promise;
                deferred.resolve($lux.apiUrls[url]);
            }
            return promise;
        };

        /**
         * Gets the URL for an API target
         *
         * @param target
         * @returns     promise, resolved when the URL is available
         */
        api.getUrlForTarget = function (target) {
            return api.getApiNames().then(function (apiUrls) {
                var url = apiUrls[target.name];
                if (target.path) {
                    url = lux.joinUrl(url, target.path);
                }
                return url;
            });
        };

        return api;
        //
        //  Execute an API call for a given request
        //  This method is hardly used directly,
        //	the ``request`` method is normally used.
        //
        //      request: a request object obtained from the ``request`` method
        function sendRequest (request) {
            //
            if (!request.baseUrl && request.name) {
                var apiUrls = $lux.apiUrls[url];

                if (apiUrls) {
                    request.baseUrl = apiUrls[request.name];
                    //
                    // No api url!
                    if (!request.baseUrl)
                        return request.error('Could not find a valid url for ' + request.name);

                    //
                } else {
                    // Fetch the api urls
                    return api.populateApiUrls(url).then(function () {
                        sendRequest(request);
                    }, request.error);
                    //
                }
            }

            if (!request.baseUrl)
                request.baseUrl = api.baseUrl();

            var opts = request.options;

            if (!opts.url) {
                var href = request.baseUrl;
                if (opts.path)
                    href = lux.joinUrl(request.baseUrl, opts.path);
                opts.url = href;
            }

            api.httpOptions(request);
            api.authentication(request);
            //
            var options = request.options;

            if (options.url) {
                $lux.log.info('Executing HTTP ' + options.method + ' request @ ' + options.url);
                $lux.http(options).then(request.success, request.error);
            }
            else
                request.error('Api url not available');
        }
    };

    return lux.apiFactory;

    //
    function _luxHttpPromise () {

        function luxHttpPromise (promise, options) {

            promise.options = function () {
                return options;
            };

            angular.forEach(luxHttpPromise, function (value, key) {
                promise[key] = value;
            });

            return promise;
        }

        luxHttpPromise.success = function (fn) {

            return luxHttpPromise(this.then(function (response) {
                var r = fn(response.data, response.status, response.headers);
                return angular.isUndefined(r) ? response : r;
            }), this.options());
        };

        luxHttpPromise.error = function (fn) {

            return luxHttpPromise(this.then(null, function (response) {
                var r = fn(response.data, response.status, response.headers);
                return angular.isUndefined(r) ? response : r;
            }), this.options());
        };

        return luxHttpPromise;
    }
});

define('lux/core/main',['lux/core/utils',
        'lux/core/message',
        'lux/core/api'], function (lux) {
    'use strict';
    return lux;
});

define('lux/main',['angular',
        'lux/core/main'], function(angular, lux) {
    'use strict';

    var extend = angular.extend,
        angular_bootstrapped = false,
        defaults = {
            url: '',    // base url for the web site
            MEDIA_URL: '',  // default url for media content
            hashPrefix: '',
            ngModules: []
        };

    //
    lux.forEach = angular.forEach;
    lux.context = extend({}, defaults, lux.context);
    lux.version = lux.context.lux_version;

    lux.media = function (url, ctx) {
        if (!ctx)
            ctx = lux.context;
        return lux.joinUrl(ctx.url, ctx.MEDIA_URL, url);
    };

    lux.loader = angular.module('lux.loader', [])

        .value('context', lux.context)

        .config(['$controllerProvider', function ($controllerProvider) {
            lux.loader.cp = $controllerProvider;
            lux.loader.controller = $controllerProvider;
        }])

        .run(['$rootScope', '$log', '$timeout', 'context',
            function (scope, $log, $timeout, context) {
                $log.info('Extend root scope with context');
                extend(scope, context);
                scope.$timeout = $timeout;
                scope.$log = $log;
            }
        ]);
    //
    //  Bootstrap the document
    //  ============================
    //
    //  * ``name``  name of the module
    //  * ``modules`` modules to include
    //
    //  These modules are appended to the modules available in the
    //  lux context object and therefore they will be processed afterwards.
    //
    lux.bootstrap = function (name, modules) {
        //
        // actual bootstrapping function
        function _bootstrap() {
            //
            // Resolve modules to load
            var mods = lux.context.ngModules;
            if(!mods) mods = [];

            // Add all modules from input
            lux.forEach(modules, function (mod) {
                mods.push(mod);
            });
            // Insert the lux loader as first module
            mods.splice(0, 0, 'lux.loader');
            angular.module(name, mods);
            angular.bootstrap(document, [name]);
        }

        if (!angular_bootstrapped) {
            angular_bootstrapped = true;
            //
            angular.element(document).ready(function() {
                _bootstrap();
            });
        }
    };

    return lux;
});

define('lux/forms/handlers',['angular',
        'lux/main'], function (angular) {
    'use strict';

    angular.module('lux.form.handlers', ['lux.services'])

        .run(['$window', '$lux', 'loginUrl', 'postLoginUrl',
            function ($window, $lux, loginUrl, postLoginUrl) {
                var formHandlers = {};
                $lux.formHandlers = formHandlers;

                formHandlers.reload = function () {
                    $window.location.reload();
                };

                formHandlers.redirectHome = function (response, scope) {
                    var href = scope.formAttrs.redirectTo || '/';
                    $window.location.href = href;
                };

                // response handler for login form
                formHandlers.login = function (response, scope) {
                    var target = scope.formAttrs.action,
                        api = $lux.api(target);
                    if (api)
                        api.token(response.data.token);
                    $window.location.href = postLoginUrl;
                };

                //
                formHandlers.passwordRecovery = function (response) {
                    var email = response.data.email;
                    if (email) {
                        var text = 'We have sent an email to <strong>' + email + '</strong>. Please follow the instructions to change your password.';
                        $lux.messages.success(text);
                    }
                    else
                        $lux.messages.error('Could not find that email');
                };

                //
                formHandlers.signUp = function (response) {
                    var email = response.data.email;
                    if (email) {
                        var text = 'We have sent an email to <strong>' + email + '</strong>. Please follow the instructions to confirm your email.';
                        $lux.messages.success(text);
                    }
                    else
                        $lux.messages.error('Something wrong, please contact the administrator');
                };

                //
                formHandlers.passwordChanged = function (response) {
                    if (response.data.success) {
                        var text = 'Password succesfully changed. You can now <a title="login" href="' + loginUrl + '">login</a> again.';
                        $lux.messages.success(text);
                    } else
                        $lux.messages.error('Could not change password');
                };

                formHandlers.enquiry = function (response) {
                    if (response.data.success) {
                        var text = 'Thank you for your feedback!';
                        $lux.messages.success(text);
                    } else
                        $lux.messages.error('Feedback form error');
                };

            }
        ]);

});

define('lux/forms/process',['angular',
        'lux/main',
        'lux/forms/handlers'], function (angular, lux) {
    'use strict';

    var formProcessors = {};

    angular.module('lux.form.process', [])

        .run(['$lux', function ($lux) {

            //
            //	Form processor
            //	=========================
            //
            //	Default Form processing function
            // 	If a submit element (input.submit or button) does not specify
            // 	a ``click`` entry, this function is used
            //
            //  Post Result
            //  -------------------
            //
            //  When a form is processed succesfully, this method will check if the
            //  ``formAttrs`` object contains a ``resultHandler`` parameter which should be
            //  a string.
            //
            //  In the event the ``resultHandler`` exists,
            //  the ``$lux.formHandlers`` object is checked if it contains a function
            //  at the ``resultHandler`` value. If it does, the function is called.
            lux.processForm = function (e) {

                e.preventDefault();
                e.stopPropagation();

                var scope = this,
                    process = formProcessor($lux, scope);

                // Flag the form as submitted
                process.form.$setSubmitted();
                //
                // Invalid?
                if (process.form.$invalid) {
                    process.form.$setDirty();
                    return;
                }
                //
                var promise = process();

                if (!promise) {
                    $lux.log.error('Could not process form. No target or api');
                    return;
                }
                //
                promise.then(
                    function (response) {
                        var data = getData(response);
                        var hookName = process.attrs.resultHandler;
                        var hook = hookName && $lux.formHandlers[hookName];
                        if (hook) {
                            hook(response, scope);
                        } else if (data.messages) {
                            scope.addMessages(data.messages);
                        } else if (process.api) {
                            // Created
                            var message = data.message;
                            if (!message) {
                                if (response.status === 201)
                                    message = 'Successfully created';
                                else
                                    message = 'Successfully updated';
                            }
                            $lux.messages.info(message);
                        }
                    },
                    function (response) {
                        var data = getData(response);

                        if (data.errors) {
                            scope.addMessages(data.errors, 'error');
                        } else {
                            var message = data.message;
                            if (!message) {
                                var status = status || data.status || 501;
                                message = 'Response error (' + status + ')';
                            }
                            $lux.messages.error(message);
                        }
                    });

                function getData (response) {
                    process.form.$pending = false;
                    return response.data || {};
                }
            };
        }]);

    formProcessors.default = function ($lux, p) {

        if (p.api) {
            return p.api.request(p.method, p.target, p.model);
        } else if (p.target) {
            var enctype = p.attrs.enctype || 'application/json',
                ct = enctype.split(';')[0],
                options = {
                    url: p.target,
                    method: p.method,
                    data: p.model,
                    transformRequest: $lux.formData(ct)
                };
            // Let the browser choose the content type
            if (ct === 'application/x-www-form-urlencoded' || ct === 'multipart/form-data') {
                options.headers = {
                    'content-type': undefined
                };
            } else {
                options.headers = {
                    'content-type': ct
                };
            }
            return $lux.http(options);
        }
    };

    return formProcessors;

    //
    //  Create a form processor with all the form information as atributes
    function formProcessor ($lux, scope) {

        var form = scope[scope.formName];

        function process () {
            var _process = formProcessors[scope.formProcessor || 'default'];
            // set as pending
            form.$pending = true;
            // clear form messages
            scope.formMessages = {};
            return _process($lux, process);
        }

        process.form = form;
        process.model = scope[scope.formModelName];
        process.attrs = scope.formAttrs;
        process.target = scope.formAttrs.action;
        process.method = scope.formAttrs.method || 'post';
        process.api = angular.isObject(process.target) ? $lux.api(process.target) : null;

        return process;
    }
});

define('lux/services/luxweb',['angular',
        'lux/main'], function (angular, lux) {
    'use strict';
    //
    //	LUX WEB API
    //	===================
    //
    //  Angular module for interacting with lux-based WEB APIs
    angular.module('lux.webapi', ['lux.services'])

        .run(['$rootScope', '$lux', function ($scope, $lux) {
            //
            if ($scope.API_URL) {
                $lux.api($scope.API_URL, luxweb).scopeApi($scope);
            }
        }]);

    //
    //	Decode JWT
    //	================
    //
    //	Decode a JASON Web Token and return the decoded object
    lux.decodeJWToken = function (token) {
        var parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        return lux.urlBase64DecodeToJSON(parts[1]);
    };

    var //
        //  HTTP verbs which don't send a csrf token in their requests
        CSRFset = ['get', 'head', 'options'],
        //
        luxweb = function (url, $lux) {

            var api = lux.apiFactory(url, $lux),
                request = api.request,
                auth_name = 'authorizations_url';

            // Set the name of the authentication endpoints
            api.authName = function (name) {
                if (arguments.length === 1) {
                    auth_name = name;
                    return api;
                } else
                    return auth_name;
            };

            // Set/Get the user token
            api.token = function () {
                return $lux.user_token;
            };

            // Perform Logout
            api.logout = function (scope) {
                var auth = $lux.authApi(api);
                if (!auth) {
                    $lux.messages.error('Error while logging out');
                    return;
                }
                scope.$emit('pre-logout');
                auth.post({
                    name: auth.authName(),
                    path: lux.context.LOGOUT_URL
                }).then(function () {
                    scope.$emit('after-logout');
                    if (lux.context.POST_LOGOUT_URL) {
                        $lux.window.location.href = lux.context.POST_LOGOUT_URL;
                    } else {
                        $lux.window.location.reload();
                    }
                }, function () {
                    $lux.messages.error('Error while logging out');
                });
            };

            // Get the user from the JWT
            api.user = function () {
                var token = api.token();
                if (token) {
                    var u = lux.decodeJWToken(token);
                    u.token = token;
                    return u;
                }
            };

            // Redirect to the LOGIN_URL
            api.login = function () {
                if (lux.context.LOGIN_URL) {
                    $lux.window.location.href = lux.context.LOGIN_URL;
                    $lux.window.reload();
                }
            };

            //
            //  Fired when a lux form uses this api to post data
            //
            //  Check the run method in the "lux.services" module for more information
            api.formReady = function (model, formScope) {
                var resolve = api.defaults().get;
                if (resolve) {
                    api.get().success(function (data) {
                        lux.forEach(data, function (value, key) {
                            // TODO: do we need a callback for JSON fields?
                            // or shall we leave it here?

                            var modelType = formScope[formScope.formModelName + 'Type'];
                            var jsonArrayKey = key.split('[]')[0];

                            // Stringify json only if has json mode enabled
                            if (modelType[jsonArrayKey] === 'json' && lux.isJsonStringify(value)) {

                                // Get rid of the brackets from the json array field
                                if (angular.isArray(value)) {
                                    key = jsonArrayKey;
                                }

                                value = angular.toJson(value, null, 4);
                            }

                            if (angular.isArray(value)) {
                                model[key] = [];
                                angular.forEach(value, function (item) {
                                    model[key].push(item.id || item);
                                });
                            } else {
                                model[key] = value.id || value;
                            }
                        });
                    });
                }
            };

            //  override request and attach error callbacks
            api.request = function (method, opts, data) {
                var promise = request.call(api, method, opts, data);
                promise.error(function (data, status) {
                    if (status === 401)
                        api.login();
                    else if (!status)
                        $lux.log.error('Server down, could not complete request');
                    else if (status === 404)
                        $lux.log.info('Endpoint not found' + ((opts.path) ? ' @ ' + opts.path : ''));
                });
                return promise;
            };

            api.httpOptions = function (request) {
                var options = request.options;

                if ($lux.csrf && CSRFset.indexOf(options.method === -1)) {
                    options.data = angular.extend(options.data || {}, $lux.csrf);
                }

                if (!options.headers)
                    options.headers = {};
                options.headers['Content-Type'] = 'application/json';
            };

            //
            // Initialise a scope with an auth api handler
            api.scopeApi = function (scope, auth) {
                //  Get the api client
                if (auth) {
                    // Register auth as the authentication client of this api
                    $lux.authApi(api, auth);
                    auth.authName(null);
                }

                scope.api = function () {
                    return $lux.api(url);
                };

                //  Get the current user
                scope.getUser = function () {
                    return api.user();
                };

                //  Logout the current user
                scope.logout = function (e) {
                    if (e && e.preventDefault) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (api.user()) api.logout(scope);
                };
            };

            return api;
        };

    return luxweb;
});

define('lux/services/luxrest',['angular',
        'lux/main',
        'lux/services/luxweb'], function (angular, lux, luxWebApi) {
    'use strict';
    //
    //	Angular Module for JS clients of Lux Rest APIs
    //	====================================================
    //
    //	If the ``API_URL`` is defined at root scope, register the
    //	javascript client with the $lux service and add functions to the root
    //	scope to retrieve the api client handler and user informations
    angular.module('lux.restapi', ['lux.services'])

        .run(['$rootScope', '$lux', function ($scope, $lux) {

            // If the root scope has an API_URL register the luxrest client
            if ($scope.API_URL) {
                //
                // web api handler
                var web = $lux.api('', luxWebApi);
                // rest api handler
                $lux.api($scope.API_URL, luxrest).scopeApi($scope, web);
            }

        }]);

    //
    //  API handler for lux rest api
    //
    //  This handler connects to lux-based rest apis and
    //
    //  * Perform authentication using username/email & password
    //  * After authentication a JWT is received and stored in the localStorage or sessionStorage
    //  * Optional second factor authentication
    //  --------------------------------------------------
    var luxrest = function (url, $lux) {

        var api = luxWebApi(url, $lux);

        api.httpOptions = function (request) {
            var options = request.options,
                headers = options.headers;
            if (!headers)
                options.headers = headers = {};
            headers['Content-Type'] = 'application/json';
        };

        // Add authentication token if available
        api.authentication = function (request) {
            //
            // If the call is for the authorizations_url api, add callback to store the token
            if (request.name === 'authorizations_url' &&
                request.options.url === request.baseUrl &&
                request.options.method === 'post') {

                request.on.success(function () {
                    // reload the Page
                    $lux.window.location.reload();
                    //api.token(data.token);
                });

            } else {
                var jwt = api.token();

                if (jwt) {
                    var headers = request.options.headers;
                    if (!headers)
                        request.options.headers = headers = {};

                    headers.Authorization = 'Bearer ' + jwt;
                }
            }
        };

        return api;
    };

    return luxrest;

});

/**
 * Include this module when using lux REST api
 */
define('lux/services/main',['lux/main',
        'lux/services/luxweb',
        'lux/services/luxrest'], function (lux) {
    'use strict';
    return lux;
});

// Lux pagination module for controlling the flow of
// repeat requests to the API.
// It can return all data at an end point or offer
// the next page on request for the relevant component
define('lux/services/pagination',['angular',
        'lux/services/main'], function (angular) {
    'use strict';

    angular.module('lux.services.pagination', ['lux.services'])

        .factory('luxPagination', ['$lux', function ($lux) {


            function luxPagination (scope, target, recursive) {
                return new LuxPagination($lux, scope, target, recursive);
            }

            luxPagination.prototype = LuxPagination.prototype;

            return luxPagination;

        }]);


    /**
    * LuxPagination constructor requires three args
    * @param scope - the angular $scope of component's directive
    * @param target {object} - containing name and url, e.g.
    * {name: "groups_url", url: "http://127.0.0.1:6050"}
    * @param recursive {boolean}- set to true if you want to recursively
    * request all data from the endpoint
    */
    function LuxPagination($lux, scope, target, recursive) {
        this.scope = scope;
        this.target = target;
        this.orgUrl = this.target.url;
        this.$lux = $lux;
        this.api = $lux.api(this.target);
        this.recursive = recursive === true ? true : false;
    }


    LuxPagination.prototype.getData = function(params, cb) {
        // getData runs $lux.api.get() followed by the component's
        // callback on the returned data or error.
        // it's up to the component to handle the error.

        this.params = params ? params : null;
        if (cb) this.cb = cb;

        this.api.get(null, this.params).then(function(data) {

            // removes search from parameters so this.params is
            // clean for next generic loadMore or new search. Also
            // adds searched flag.
            if (this.searchField) {
                data.searched = true;
                delete this.params[this.searchField];
            }

            this.cb(data);
            this.updateUrls(data);

        }.bind(this), function(error) {
            this.cb(error);
        }.bind(this));

    };

    LuxPagination.prototype.updateUrls = function(data) {
        // updateUrls creates an object containing the most
        // recent last and next links from the API

        if (data && data.data && data.data.last) {
            this.urls = {
                last: data.data.last,
                next: data.data.next ? data.data.next : false
            };
            // If the recursive param was set to true this will
            // request data using the 'next' link; if not it will emitEvent
            // so the component knows there's more data available
            if (this.recursive) this.loadMore();
            else this.emitEvent();
        }

    };

    LuxPagination.prototype.emitEvent = function() {
        // emit event if more data available, the component can
        // listen for it and choose how to deal with it
        this.scope.$emit('moreData');
    };

    LuxPagination.prototype.loadMore = function() {
        // loadMore applies new urls from updateUrls to the
        // target object and makes another getData request.

        if (!this.urls.next && !this.urls.last) throw 'Updated URLs not set.';

        if (this.urls.next === false) {
            this.target.url = this.urls.last;
        } else if (this.urls.next) {
            this.target.url = this.urls.next;
        }

        // Call API with updated target URL
        this.getData(this.params);

    };

    LuxPagination.prototype.search = function(query, searchField) {
        this.searchField = searchField;
        this.params = this.params || {};
        this.params[this.searchField] = query;
        // Set current target URL to the original target URL to reset any
        // existing limits/offsets so full endpoint is searched
        this.target.url = this.orgUrl;

        this.getData(this.params);
    };
});

define('lux/forms/utils',['angular',
        'lux/main',
        'lux/services/pagination'], function (angular, lux) {
    'use strict';

    angular.module('lux.form.utils', ['lux.services.pagination'])

        .constant('lazyLoadOffset', 40) // API will be called this number of pixels
                                        // before bottom of UIselect list

        .directive('remoteOptions', ['$lux', 'luxPaginationFactory', 'lazyLoadOffset',
            function ($lux, LuxPagination, lazyLoadOffset) {

                return {
                    link: link
                };

                function remoteOptions(luxPag, target, scope, attrs, element) {

                    function lazyLoad(e) {
                        // lazyLoad requests the next page of data from the API
                        // when nearing the bottom of a <select> list
                        var uiSelect = element[0].querySelector('.ui-select-choices');

                        e.stopPropagation();
                        if (!uiSelect) return;

                        var uiSelectChild = uiSelect.querySelector('.ui-select-choices-group');
                        uiSelect = angular.element(uiSelect);

                        uiSelect.on('scroll', function () {
                            var offset = uiSelectChild.clientHeight - this.clientHeight - lazyLoadOffset;

                            if (this.scrollTop > offset) {
                                uiSelect.off();
                                luxPag.loadMore();
                            }
                        });

                    }

                    function enableSearch() {
                        if (searchInput.data().onKeyUp) return;

                        searchInput.data('onKeyUp', true);
                        searchInput.on('keyup', function (e) {
                            var query = e.srcElement.value;
                            var searchField = attrs.remoteOptionsId === 'id' ? nameOpts.source : attrs.remoteOptionsId;

                            cleanSearchResults();

                            // Only call API with search if query is > 3 chars
                            if (query.length > 3) {
                                luxPag.search(query, searchField);
                            }
                        });
                    }

                    function loopAndPush(data) {
                        angular.forEach(data.data.result, function (val) {
                            var name;
                            if (nameFromFormat) {
                                name = lux.formatString(nameOpts.source, val);
                            } else {
                                name = val[nameOpts.source];
                            }

                            options.push({
                                id: val[id],
                                name: name,
                                searched: data.searched ? true : false
                            });
                        });

                        cleanDuplicates();
                    }

                    function cleanSearchResults() {
                        // options objects containing data.searched will be removed
                        // after relevant search.
                        for (var i = 0; i < options.length; i++) {
                            if (options[i].searched) options.splice(i, 1);
                        }
                    }

                    function cleanDuplicates() {
                        // $timeout waits for rootScope.$digest to finish,
                        // then removes duplicates from options list on the next tick.
                        $lux.timeout(function () {
                            return scope.$select.selected;
                        }).then(function (selected) {
                            for (var a = 0; a < options.length; a++) {
                                for (var b = 0; b < selected.length; b++) {
                                    if (options[a].id === selected[b].id) options.splice(a, 1);
                                }
                            }
                        });
                    }

                    function buildSelect(data) {
                        // buildSelect uses data from the API to populate
                        // the options variable, which builds our <select> list
                        if (data.data && data.data.error) {
                            options.splice(0, 1, {
                                id: 'placeholder',
                                name: 'Unable to load data...'
                            });
                            throw new Error(data.data.message);
                        } else {
                            loopAndPush(data);
                        }
                    }

                    var id = attrs.remoteOptionsId || 'id';
                    var nameOpts = attrs.remoteOptionsValue ? angular.fromJson(attrs.remoteOptionsValue) : {
                        type: 'field',
                        source: 'id'
                    };
                    var nameFromFormat = nameOpts.type === 'formatString';
                    var initialValue = {};
                    var params = angular.fromJson(attrs.remoteOptionsParams || '{}');
                    var options = [];
                    var searchInput = angular.element(element[0].querySelector('input[type=text]'));

                    scope[target.name] = options;

                    initialValue.id = '';
                    initialValue.name = 'Loading...';

                    options.push(initialValue);

                    // Set empty value if field was not filled
                    if (angular.isUndefined(scope[scope.formModelName][attrs.name])) {
                        scope[scope.formModelName][attrs.name] = '';
                    }

                    if (attrs.multiple) {
                        // Increasing default API call limit as UISelect multiple
                        // displays all preselected options
                        params.limit = 200;
                        params.sortby = nameOpts.source ? nameOpts.source + ':asc' : 'id:asc';
                        options.splice(0, 1);
                    } else {
                        params.sortby = params.sortby ? params.sortby + ':asc' : 'id:asc';
                        // Options with id 'placeholder' are disabled in
                        // forms.js so users can't select them
                        options[0] = {
                            name: 'Please select...',
                            id: 'placeholder'
                        };
                    }

                    // Use LuxPagination's getData method to call the api
                    // with relevant parameters and pass in buildSelect as callback
                    luxPag.getData(params, buildSelect);
                    // Listen for LuxPagination to emit 'moreData' then run
                    // lazyLoad and enableSearch
                    scope.$on('moreData', function (e) {
                        lazyLoad(e);
                        enableSearch();
                    });
                }

                function link(scope, element, attrs) {

                    if (attrs.remoteOptions) {
                        var target = angular.fromJson(attrs.remoteOptions);
                        var luxPag = new LuxPagination(scope, target, attrs.multiple ? true : false);

                        if (luxPag && target.name)
                            return remoteOptions(luxPag, target, scope, attrs, element);
                    }

                    // TODO: message
                }
            }
        ])

        .directive('selectOnClick', ['$window', function ($window) {
            return {
                restrict: 'A',
                link: function (scope, element) {
                    element.on('click', function () {
                        if (!$window.getSelection().toString()) {
                            // Required for mobile Safari
                            this.setSelectionRange(0, this.value.length);
                        }
                    });
                }
            };
        }])
        //
        .directive('checkRepeat', ['$log', function (log) {
            return {
                require: 'ngModel',

                restrict: 'A',

                link: function(scope, element, attrs, ctrl) {
                    var other = element.inheritedData('$formController')[attrs.checkRepeat];
                    if (other) {
                        ctrl.$parsers.push(function(value) {
                            if(value === other.$viewValue) {
                                ctrl.$setValidity('repeat', true);
                                return value;
                            }
                            ctrl.$setValidity('repeat', false);
                        });

                        other.$parsers.push(function(value) {
                            ctrl.$setValidity('repeat', value === ctrl.$viewValue);
                            return value;
                        });
                    } else {
                        log.error('Check repeat directive could not find ' + attrs.checkRepeat);
                    }
                }
            };
        }]);

});

define('lux/forms/main',['angular',
        'lux/main',
        'lux/forms/process',
        'lux/forms/utils',
        'lux/forms/handlers'], function (angular, lux, formProcessors) {
    'use strict';

    var extend = angular.extend,
        forEach = angular.forEach,
        extendArray = lux.extendArray,
        isString = lux.isString,
        isObject = lux.isObject,
        isArray = lux.isArray,
        baseAttributes = ['id', 'name', 'title', 'style'],
        inputAttributes = extendArray([], baseAttributes, [
            'disabled', 'readonly', 'type', 'value', 'placeholder',
            'autocapitalize', 'autocorrect']),
        textareaAttributes = extendArray([], baseAttributes, [
            'disabled', 'readonly', 'placeholder', 'rows', 'cols']),
        buttonAttributes = extendArray([], baseAttributes, ['disabled']),
        // Don't include action in the form attributes
        formAttributes = extendArray([], baseAttributes, [
            'accept-charset', 'autocomplete',
            'enctype', 'method', 'novalidate', 'target']),
        validationAttributes = ['minlength', 'maxlength', 'min', 'max', 'required'],
        ngAttributes = ['disabled', 'minlength', 'maxlength', 'required'],
        formid = function () {
            return 'f' + lux.s4();
        };

    lux.forms = {
        overrides: [],
        directives: [],
        processors: formProcessors
    };

    function extendForm (form, form2) {
        form = extend({}, form, form2);
        lux.forms.overrides.forEach(function (override) {
            override(form);
        });
        return form;
    }
    //
    // Form module for lux
    //
    //  Forms are created form a JSON object
    //
    //  Forms layouts:
    //
    //      - default
    //      - inline
    //      - horizontal
    //
    //  Events:
    //
    //      formReady: triggered once the form has rendered
    //          arguments: formmodel, formscope
    //
    //      formFieldChange: triggered when a form field changes:
    //          arguments: formmodel, field (changed)
    //
    angular.module('lux.form', ['lux.form.utils', 'lux.form.handlers', 'lux.form.process'])
        //
        .constant('formDefaults', {
            // Default layout
            layout: 'default',
            // for horizontal layout
            labelSpan: 2,
            debounce: 500,
            showLabels: true,
            novalidate: true,
            //
            dateTypes: ['date', 'datetime', 'datetime-local'],
            defaultDatePlaceholder: 'YYYY-MM-DD',
            //
            formErrorClass: 'form-error',
            FORMKEY: 'm__form',
            useNgFileUpload: true
        })
        //
        .constant('defaultFormElements', function () {
            return {
                'text': {element: 'input', type: 'text', editable: true, textBased: true},
                'date': {element: 'input', type: 'date', editable: true, textBased: true},
                'datetime': {element: 'input', type: 'datetime', editable: true, textBased: true},
                'datetime-local': {element: 'input', type: 'datetime-local', editable: true, textBased: true},
                'email': {element: 'input', type: 'email', editable: true, textBased: true},
                'month': {element: 'input', type: 'month', editable: true, textBased: true},
                'number': {element: 'input', type: 'number', editable: true, textBased: true},
                'password': {element: 'input', type: 'password', editable: true, textBased: true},
                'search': {element: 'input', type: 'search', editable: true, textBased: true},
                'tel': {element: 'input', type: 'tel', editable: true, textBased: true},
                'textarea': {element: 'textarea', editable: true, textBased: true},
                'time': {element: 'input', type: 'time', editable: true, textBased: true},
                'url': {element: 'input', type: 'url', editable: true, textBased: true},
                'week': {element: 'input', type: 'week', editable: true, textBased: true},
                //  Specialized editables
                'checkbox': {element: 'input', type: 'checkbox', editable: true, textBased: false},
                'color': {element: 'input', type: 'color', editable: true, textBased: false},
                'file': {element: 'input', type: 'file', editable: true, textBased: false},
                'range': {element: 'input', type: 'range', editable: true, textBased: false},
                'select': {element: 'select', editable: true, textBased: false},
                //  Pseudo-non-editables (containers)
                'checklist': {element: 'div', editable: false, textBased: false},
                'fieldset': {element: 'fieldset', editable: false, textBased: false},
                'div': {element: 'div', editable: false, textBased: false},
                'form': {element: 'form', editable: false, textBased: false},
                'radio': {element: 'div', editable: false, textBased: false},
                //  Non-editables (mostly buttons)
                'button': {element: 'button', type: 'button', editable: false, textBased: false},
                'hidden': {element: 'input', type: 'hidden', editable: false, textBased: false},
                'image': {element: 'input', type: 'image', editable: false, textBased: false},
                'legend': {element: 'legend', editable: false, textBased: false},
                'reset': {element: 'button', type: 'reset', editable: false, textBased: false},
                'submit': {element: 'button', type: 'submit', editable: false, textBased: false}
            };
        })
        //
        .factory('formElements', ['defaultFormElements', function (defaultFormElements) {
            return defaultFormElements;
        }])
        //
        .run(['$rootScope', '$lux', 'formDefaults',
            function (scope, $lux, formDefaults) {
                //
                //  Listen for a Lux form to be available
                //  If it uses the api for posting, register with it
                scope.$on('formReady', function (e, model, formScope) {
                    var attrs = formScope.formAttrs,
                        action = attrs ? attrs.action : null,
                        actionType = attrs ? attrs.actionType : null;

                    if (isObject(action) && actionType !== 'create') {
                        var api = $lux.api(action);
                        if (api) {
                            $lux.log.info('Form ' + formScope.formModelName + ' registered with "' +
                                api.toString() + '" api');
                            api.formReady(model, formScope);
                        }
                    }
                    //
                    // Convert date string to date object
                    lux.forms.directives.push(fieldToDate(formDefaults));
                });
            }]
        )
        //
        // A factory for rendering form fields
        .factory('baseForm', ['$log', '$http', '$document', '$templateCache',
            'formDefaults', 'formElements',
            function (log, $http, $document, $templateCache, formDefaults, formElements) {
                //
                var elements = formElements();

                return {
                    name: 'default',
                    //
                    elements: elements,
                    //
                    className: '',
                    //
                    inputGroupClass: 'form-group',
                    //
                    inputHiddenClass: 'form-hidden',
                    //
                    inputClass: 'form-control',
                    //
                    buttonClass: 'btn btn-default',
                    //
                    template: template,
                    //
                    // Create a form element
                    createElement: function (driver, scope) {

                        /**
                         * Builds infomation about type and text mode used in the field.
                         * These informations are used in `api.formReady` method.

                         * @param formModelName {string} - name of the model
                         * @param field {object}
                         * @param fieldType {string} - type of the field
                         */
                        function buildFieldInfo(formModelName, field, fieldType) {
                            var typeConfig = formModelName + 'Type';
                            var textMode = lux.getJsonOrNone(field.text_edit);
                            scope[typeConfig] = scope[typeConfig] || {};

                            if (textMode !== null)
                                scope[typeConfig][field.name] = textMode.mode || '';
                            else
                                scope[typeConfig][field.name] = fieldType;
                        }

                        var self = this,
                            thisField = scope.field,
                            tc = thisField.type.split('.'),
                            info = elements[tc.splice(0, 1)[0]],
                            renderer,
                            fieldType;

                        scope.extraClasses = tc.join(' ');
                        scope.info = info;

                        if (info) {
                            if (info.type && angular.isFunction(self[info.type]))
                            // Pick the renderer by checking `type`
                                fieldType = info.type;
                            else
                            // If no element type, use the `element`
                                fieldType = info.element;
                        }

                        renderer = self[fieldType];

                        buildFieldInfo(scope.formModelName, thisField, fieldType);

                        if (!renderer)
                            renderer = self.renderNotElements;

                        var element = renderer.call(self, scope);

                        forEach(scope.children, function (child) {
                            var field = child.field;

                            if (field) {

                                // extend child.field with options
                                forEach(formDefaults, function (_, name) {
                                    if (angular.isUndefined(field[name]))
                                        field[name] = scope.field[name];
                                });
                                //
                                // Make sure children is defined, otherwise it will be inherited from the parent scope
                                if (angular.isUndefined(child.children))
                                    child.children = null;
                                child = driver.createElement(extend(scope, child));

                                if (isArray(child))
                                    forEach(child, function (c) {
                                        element.append(c);
                                    });
                                else if (child)
                                    element.append(child);
                            } else {
                                log.error('form child without field');
                            }
                        });
                        // Reinstate the field
                        scope.field = thisField;
                        return element;
                    },
                    //
                    addAttrs: function (scope, element, attributes) {
                        forEach(scope.field, function (value, name) {
                            if (attributes.indexOf(name) > -1) {
                                if (ngAttributes.indexOf(name) > -1)
                                    element.attr('ng-' + name, value);
                                else
                                    element.attr(name, value);
                            } else if (name.substring(0, 5) === 'data-') {
                                element.attr(name, value);
                            }
                        });
                        return element;
                    },
                    //
                    renderNotForm: function (scope) {
                        var field = scope.field;
                        return angular.element($document[0].createElement('span')).html(field.label || '');
                    },
                    //
                    fillDefaults: function (scope) {
                        var field = scope.field;
                        field.label = field.label || field.name;
                        scope.formCount++;
                        if (!field.id)
                            field.id = field.name + '-' + scope.formid + '-' + scope.formCount;
                    },
                    //
                    form: function (scope) {
                        var field = scope.field,
                            info = scope.info,
                            form = angular.element($document[0].createElement(info.element))
                                .attr('role', 'form').addClass(this.className)
                                .attr('ng-model', field.model);
                        this.formMessages(scope, form);
                        return this.addAttrs(scope, form, formAttributes);
                    },
                    //
                    'ng-form': function (scope) {
                        return this.form(scope);
                    },
                    //
                    // Render a fieldset
                    fieldset: function (scope) {
                        var field = scope.field,
                            info = scope.info,
                            element = angular.element($document[0].createElement(info.element));
                        if (field.label)
                            element.append(angular.element($document[0].createElement('legend')).html(field.label));
                        return element;
                    },
                    //
                    div: function (scope) {
                        var info = scope.info,
                            element = angular.element($document[0].createElement(info.element)).addClass(scope.extraClasses);
                        return element;
                    },
                    //
                    radio: function (scope) {
                        this.fillDefaults(scope);

                        var field = scope.field,
                            info = scope.info,
                            input = angular.element($document[0].createElement(info.element)),
                            label = angular.element($document[0].createElement('label')).attr('for', field.id),
                            span = angular.element($document[0].createElement('span'))
                                .css('margin-left', '5px')
                                .css('position', 'relative')
                                .css('bottom', '2px')
                                .html(field.label),
                            element = angular.element($document[0].createElement('div')).addClass(this.element);

                        input.attr('ng-model', scope.formModelName + '["' + field.name + '"]');

                        forEach(inputAttributes, function (name) {
                            if (field[name]) input.attr(name, field[name]);
                        });

                        label.append(input).append(span);
                        element.append(label);
                        return this.onChange(scope, this.inputError(scope, element));
                    },
                    //
                    checkbox: function (scope) {
                        return this.radio(scope);
                    },
                    //
                    input: function (scope, attributes) {
                        this.fillDefaults(scope);

                        var field = scope.field,
                            info = scope.info,
                            input = angular.element($document[0].createElement(info.element)).addClass(this.inputClass),
                            label = angular.element($document[0].createElement('label')).attr('for', field.id).html(field.label),
                            modelOptions = angular.extend({}, field.modelOptions, scope.inputModelOptions),
                            element;

                        // Add model attribute
                        input.attr('ng-model', scope.formModelName + '["' + field.name + '"]');
                        // Add input model options
                        input.attr('ng-model-options', angular.toJson(modelOptions));

                        // Add default placeholder to date field if not exist
                        if (field.type === 'date' && angular.isUndefined(field.placeholder)) {
                            field.placeholder = formDefaults.defaultDatePlaceholder;
                        }

                        if (!field.showLabels || field.type === 'hidden') {
                            label.addClass('sr-only');
                            // Add placeholder if not defined
                            if (angular.isUndefined(field.placeholder))
                                field.placeholder = field.label;
                        }

                        this.addAttrs(scope, input, attributes || inputAttributes);
                        if (angular.isDefined(field.value)) {
                            scope[scope.formModelName][field.name] = field.value;
                            if (info.textBased)
                                input.attr('value', field.value);
                        }

                        // Add directive to element
                        input = addDirectives(scope, input);

                        if (this.inputGroupClass) {
                            element = angular.element($document[0].createElement('div'));
                            if (field.type === 'hidden') element.addClass(this.inputHiddenClass);
                            else element.addClass(this.inputGroupClass);
                            element.append(label).append(input);
                        } else {
                            element = [label, input];
                        }
                        return this.onChange(scope, this.inputError(scope, element));
                    },
                    //
                    textarea: function (scope) {
                        return this.input(scope, textareaAttributes);
                    },
                    //
                    // Create a select element
                    select: function (scope) {
                        var field = scope.field,
                            groups = {},
                            groupList = [],
                            options = [],
                            group;

                        forEach(field.options, function (opt) {
                            if (angular.isString(opt)) {
                                opt = {'value': opt};
                            } else if (isArray(opt)) {
                                opt = {
                                    'value': opt[0],
                                    'repr': opt[1] || opt[0]
                                };
                            }
                            if (opt.group) {
                                group = groups[opt.group];
                                if (!group) {
                                    group = {name: opt.group, options: []};
                                    groups[opt.group] = group;
                                    groupList.push(group);
                                }
                                group.options.push(opt);
                            } else
                                options.push(opt);
                            // Set the default value if not available
                            if (!field.value) field.value = opt.value;
                        });

                        var element = this.input(scope);

                        this.selectWidget(scope, element, field, groupList, options);

                        return this.onChange(scope, element);
                    },
                    //
                    // Standard select widget
                    selectWidget: function (scope, element, field, groupList, options) {
                        var grp,
                            placeholder,
                            select = _select(scope.info.element, element);

                        if (!field.multiple && angular.isUndefined(field['data-remote-options'])) {
                            placeholder = angular.element($document[0].createElement('option'))
                                .attr('value', '').text(field.placeholder || formDefaults.defaultSelectPlaceholder);

                            if (field.required) {
                                placeholder.prop('disabled', true);
                            }

                            select.append(placeholder);
                            if (angular.isUndefined(field.value)) {
                                field.value = '';
                            }
                        }

                        if (groupList.length) {
                            if (options.length)
                                groupList.push({name: 'other', options: options});

                            forEach(groupList, function (group) {
                                grp = angular.element($document[0].createElement('optgroup'))
                                    .attr('label', group.name);
                                select.append(grp);
                                forEach(group.options, function (opt) {
                                    opt = angular.element($document[0].createElement('option'))
                                        .attr('value', opt.value).html(opt.repr || opt.value);
                                    grp.append(opt);
                                });
                            });
                        } else {
                            forEach(options, function (opt) {
                                opt = angular.element($document[0].createElement('option'))
                                    .attr('value', opt.value).html(opt.repr || opt.value);
                                select.append(opt);
                            });
                        }

                        if (field.multiple)
                            select.attr('multiple', true);
                    },
                    //
                    button: function (scope) {
                        var field = scope.field,
                            info = scope.info,
                            element = angular.element($document[0].createElement(info.element)).addClass(this.buttonClass);
                        field.name = field.name || info.element;
                        field.label = field.label || field.name;
                        element.html(field.label);
                        this.addAttrs(scope, element, buttonAttributes);
                        return this.onClick(scope, element);
                    },
                    //
                    onClick: function (scope, element) {
                        var name = element.attr('name'),
                            field = scope.field,
                            clickname = name + 'Click',
                            self = this;
                        //
                        // scope function
                        scope[clickname] = function (e) {
                            if (scope.$broadcast(clickname, e).defaultPrevented) return;
                            if (scope.$emit(clickname, e).defaultPrevented) return;

                            // Get the form processing function
                            var callback = self.processForm(scope);
                            //
                            if (field.click) {
                                callback = lux.getObject(field, 'click', scope);
                                if (!angular.isFunction(callback)) {
                                    log.error('Could not locate click function "' + field.click + '" for button');
                                    return;
                                }
                            }
                            callback.call(this, e);
                        };
                        element.attr('ng-click', clickname + '($event)');
                        return element;
                    },
                    //
                    //  Add change event
                    onChange: function (scope, element) {
                        var field = scope.field,
                            input = angular.element(element[0].querySelector(scope.info.element));
                        input.attr('ng-change', 'fireFieldChange("' + field.name + '")');
                        return element;
                    },
                    //
                    // Add input error elements to the input element.
                    // Each input element may have one or more error handler depending
                    // on its type and attributes
                    inputError: function (scope, element) {
                        var field = scope.field,
                            self = this,
                        // True when the form is submitted
                            submitted = scope.formName + '.$submitted',
                        // True if the field is dirty
                            dirty = joinField(scope.formName, field.name, '$dirty'),
                            invalid = joinField(scope.formName, field.name, '$invalid'),
                            error = joinField(scope.formName, field.name, '$error') + '.',
                            input = angular.element(element[0].querySelector(scope.info.element)),
                            p = angular.element($document[0].createElement('p'))
                                .attr('ng-show', '(' + submitted + ' || ' + dirty + ') && ' + invalid)
                                .addClass('text-danger error-block')
                                .addClass(scope.formErrorClass),
                            value,
                            attrname;
                        // Loop through validation attributes
                        forEach(validationAttributes, function (attr) {
                            value = field[attr];
                            attrname = attr;
                            if (angular.isDefined(value) && value !== false && value !== null) {
                                if (ngAttributes.indexOf(attr) > -1) attrname = 'ng-' + attr;
                                input.attr(attrname, value);
                                p.append(angular.element($document[0].createElement('span'))
                                    .attr('ng-show', error + attr)
                                    .html(self.errorMessage(scope, attr)));
                            }
                        });

                        // Add the invalid handler if not available
                        var errors = p.children().length,
                            nameError = '$invalid';
                        if (errors)
                            nameError += ' && !' + joinField(scope.formName, field.name, '$error.required');
                        // Show only if server side errors don't exist
                        nameError += ' && !formErrors["' + field.name + '"]';
                        p.append(this.fieldErrorElement(scope, nameError, self.errorMessage(scope, 'invalid')));

                        // Add the invalid handler for server side errors
                        var name = '$invalid';
                        name += ' && !' + joinField(scope.formName, field.name, '$error.required');
                        // Show only if server side errors exists
                        name += ' && formErrors["' + field.name + '"]';
                        p.append(
                            this.fieldErrorElement(scope, name, self.errorMessage(scope, 'invalid'))
                                .html('{{formErrors["' + field.name + '"]}}')
                        );

                        return element.append(p);
                    },
                    //
                    fieldErrorElement: function (scope, name, msg) {
                        var field = scope.field,
                            value = joinField(scope.formName, field.name, name);

                        return angular.element($document[0].createElement('span'))
                            .attr('ng-show', value)
                            .html(msg);
                    },
                    //
                    // Add element which containes form messages and errors
                    formMessages: function (scope, form) {
                        var messages = angular.element($document[0].createElement('p')),
                            a = scope.formAttrs;
                        messages.attr('ng-repeat', 'message in formMessages.' + a.FORMKEY)
                            .attr('ng-bind', 'message.message')
                            .attr('ng-class', 'message.error ? "text-danger" : "text-info"');
                        return form.append(messages);
                    },
                    //
                    errorMessage: function (scope, attr) {
                        var message = attr + 'Message',
                            field = scope.field,
                            handler = this[attr + 'ErrorMessage'] || this.defaultErrorMesage;
                        return field[message] || handler.call(this, scope);
                    },
                    //
                    // Default error Message when the field is invalid
                    defaultErrorMesage: function (scope) {
                        var type = scope.field.type;
                        return 'Not a valid ' + type;
                    },
                    //
                    minErrorMessage: function (scope) {
                        return 'Must be greater than ' + scope.field.min;
                    },
                    //
                    maxErrorMessage: function (scope) {
                        return 'Must be less than ' + scope.field.max;
                    },
                    //
                    maxlengthErrorMessage: function (scope) {
                        return 'Too long, must be less than ' + scope.field.maxlength;
                    },
                    //
                    minlengthErrorMessage: function (scope) {
                        return 'Too short, must be more than ' + scope.field.minlength;
                    },
                    //
                    requiredErrorMessage: function (scope) {
                        var msg = scope.field.required_error;
                        return msg || scope.field.label + ' is required';
                    },
                    //
                    // Return the function to handle form processing
                    processForm: function (scope) {
                        return scope.processForm || lux.processForm;
                    }
                };

                function template (url) {
                    return $http.get(url, {cache: $templateCache}).then(function (result) {
                        return result.data;
                    });
                }

                function _select(tag, element) {
                    if (isArray(element)) {
                        for (var i = 0; i < element.length; ++i) {
                            if (element[0].tagName === tag)
                                return element;
                        }
                    } else {
                        return angular.element(element[0].querySelector(tag));
                    }
                }
            }
        ])
        //
        .factory('standardForm', ['baseForm', function (baseForm) {
            return extendForm(baseForm);
        }])
        //
        // Bootstrap Horizontal form renderer
        .factory('horizontalForm', ['$document', 'baseForm', function ($document, baseForm) {
            //
            // extend the standardForm factory
            var baseInput = baseForm.input,
                baseButton = baseForm.button,
                form = extendForm(baseForm, {
                    name: 'horizontal',
                    className: 'form-horizontal',
                    input: input,
                    button: button
                });

            return form;

            function input (scope) {
                var element = baseInput(scope),
                    children = element.children(),
                    labelSpan = scope.field.labelSpan ? +scope.field.labelSpan : 2,
                    wrapper = angular.element($document[0].createElement('div'));
                labelSpan = Math.max(2, Math.min(labelSpan, 10));
                angular.element(children[0]).addClass('control-label col-sm-' + labelSpan);
                wrapper.addClass('col-sm-' + (12-labelSpan));
                for (var i=1; i<children.length; ++i)
                    wrapper.append(angular.element(children[i]));
                return element.append(wrapper);
            }

            function button (scope) {
                var element = baseButton(scope),
                    labelSpan = scope.field.labelSpan ? +scope.field.labelSpan : 2,
                    outer = angular.element($document[0].createElement('div')).addClass(form.inputGroupClass),
                    wrapper = angular.element($document[0].createElement('div'));
                labelSpan = Math.max(2, Math.min(labelSpan, 10));
                wrapper.addClass('col-sm-offset-' + labelSpan)
                       .addClass('col-sm-' + (12-labelSpan));
                outer.append(wrapper.append(element));
                return outer;
            }
        }])
        //
        .factory('inlineForm', ['baseForm', function (baseForm) {
            var baseInput = baseForm.input;

            return extendForm(baseForm, {
                name: 'inline',
                className: 'form-inline',
                input: input
            });

            function input (scope) {
                var element = baseInput(scope);
                angular.element(element[0].getElementsByTagName('label')).addClass('sr-only');
                return element;
            }
        }])
        //
        .factory('formRenderer', ['$lux', '$compile', 'formDefaults',
            'standardForm', 'horizontalForm', 'inlineForm',
            function ($lux, $compile, formDefaults, standardForm, horizontalForm, inlineForm) {
                //
                function renderer(scope, element, attrs) {
                    var data = lux.getOptions(attrs);

                    // No data, maybe this form was loaded via angular ui router
                    // try to evaluate internal scripts
                    if (!data) {
                        var scripts = element[0].getElementsByTagName('script');
                        angular.forEach(scripts, function (js) {
                            lux.globalEval(js.innerHTML);
                        });
                        data = lux.getOptions(attrs);
                    }

                    if (data && data.field) {
                        var form = data.field,
                            formmodel = {};

                        // extend with form defaults
                        data.field = extend({}, formDefaults, form);
                        extend(scope, data);
                        form = scope.field;
                        if (form.model) {
                            if (!form.name)
                                form.name = form.model + 'form';
                            scope.$parent[form.model] = formmodel;
                        } else {
                            if (!form.name)
                                form.name = 'form';
                            form.model = form.name + 'Model';
                        }
                        scope.formName = form.name;
                        scope.formModelName = form.model;
                        //
                        scope[scope.formModelName] = formmodel;
                        scope.formAttrs = form;
                        scope.formClasses = {};
                        scope.formErrors = {};
                        scope.formMessages = {};
                        scope.inputModelOptions = {
                            debounce: formDefaults.debounce
                        };
                        scope.$lux = $lux;
                        if (!form.id)
                            form.id = formid();
                        scope.formid = form.id;
                        scope.formCount = 0;

                        scope.addMessages = function (messages, error) {

                            forEach(messages, function (message) {
                                if (isString(message))
                                    message = {message: message};

                                var field = message.field;
                                if (field && !scope[scope.formName].hasOwnProperty(field)) {
                                    message.message = field + ' ' + message.message;
                                    field = formDefaults.FORMKEY;
                                } else if (!field) {
                                    field = formDefaults.FORMKEY;
                                }

                                if (error) message.error = error;

                                scope.formMessages[field] = [message];

                                if (message.error && field !== formDefaults.FORMKEY) {
                                    scope.formErrors[field] = message.message;
                                    scope[scope.formName][field].$invalid = true;
                                }
                            });
                        };

                        scope.fireFieldChange = function (field) {
                            // Delete previous field error from server side
                            if (angular.isDefined(scope.formErrors[field])) {
                                delete scope.formErrors[field];
                            }
                            // Triggered every time a form field changes
                            scope.$broadcast('fieldChange', formmodel, field);
                            scope.$emit('formFieldChange', formmodel, field);
                        };
                    } else {
                        $lux.log.error('Form data does not contain field entry');
                    }
                }

                //
                renderer.createForm = function (scope, element) {
                    var form = scope.field;
                    if (form) {
                        var formElement = renderer.createElement(scope);
                        //  Compile and update DOM
                        if (formElement) {
                            renderer.preCompile(scope, formElement);
                            $compile(formElement)(scope);
                            element.replaceWith(formElement);
                            renderer.postCompile(scope, formElement);
                        }
                    }
                };

                renderer.createElement = function (scope) {
                    var field = scope.field;

                    if (this[field.layout])
                        return this[field.layout].createElement(this, scope);
                    else
                        $lux.log.error('Layout "' + field.layout + '" not available, cannot render form');
                };

                renderer.preCompile = function () {
                };

                renderer.postCompile = function () {
                };

                renderer.checkField = function (name) {
                    var checker = this['check_' + name];
                    // There may be a custom field checker
                    if (checker)
                        checker.call(this);
                    else {
                        var field = this.form[name];
                        if (field.$valid)
                            this.formClasses[name] = 'has-success';
                        else if (field.$dirty) {
                            this.formErrors[name] = name + ' is not valid';
                            this.formClasses[name] = 'has-error';
                        }
                    }
                };

                renderer.processForm = function (scope) {
                    // Clear form errors and messages
                    scope.formMessages = [];
                    scope.formErrors = [];

                    if (scope.form.$invalid) {
                        return scope.showErrors();
                    }
                };

                // Create the directive
                renderer[standardForm.name] = standardForm;

                renderer[horizontalForm.name] = horizontalForm;

                renderer[inlineForm.name] = inlineForm;

                return renderer;
            }
        ])
        //
        // Lux form
        .directive('luxForm', ['formRenderer', function (formRenderer) {
            return {
                restrict: 'AE',
                //
                scope: {},
                //
                compile: function () {
                    return {
                        pre: function (scope, element, attr) {
                            // Initialise the scope from the attributes
                            formRenderer(scope, element, attr);
                        },
                        post: function (scope, element) {
                            // create the form
                            formRenderer.createForm(scope, element);
                            // Emit the form upwards through the scope hierarchy
                            scope.$emit('formReady', scope[scope.formModelName], scope);
                        }
                    };
                }
            };
        }])
        //
        // A directive which add keyup and change event callaback
        .directive('watchChange', [function() {
            return {
                scope: {
                    onchange: '&watchChange'
                },
                //
                link: function(scope, element) {
                    element.on('keyup', function() {
                        scope.$apply(function () {
                            scope.onchange();
                        });
                    }).on('change', function() {
                        scope.$apply(function () {
                            scope.onchange();
                        });
                    });
                }
            };
        }])
        //
        // Format string date to date object
        .directive('formatDate', [function () {
            return {
                require: '?ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    // All date-related inputs like <input type='date'>
                    // require the model to be a Date object in Angular 1.3+.
                    ngModel.$formatters.push(function(modelValue){
                        if (angular.isString(modelValue) || angular.isNumber(modelValue))
                            return new Date(modelValue);
                        return modelValue;
                    });
                }
            };
        }]);

    return lux;

    function joinField(model, name, extra) {
        return model + '["' + name + '"].' + extra;
    }

    function fieldToDate(formDefaults) {

        return convert;

        function convert(scope, element) {
            if (formDefaults.dateTypes.indexOf(scope.field.type) > -1)
                element.attr('format-date', '');
        }
    }

    function addDirectives(scope, element) {
        angular.forEach(lux.forms.directives, function (callback) {
            callback(scope, element);
        });
        return element;
    }
});

define('lux/nav/templates',['angular'], function (angular) {
    "use strict";

    angular.module('lux.nav.templates', [])
        .run(["$templateCache", function ($templateCache) {

            $templateCache.put("lux/nav/templates/link.tpl.html",
                     "<a ng-href=\"{{link.href}}\" title=\"{{link.title}}\" ng-click=\"links.click($event, link)\"\n" +
         "ng-attr-target=\"{{link.target}}\" ng-class=\"link.klass\" bs-tooltip=\"tooltip\">\n" +
         "<span ng-if=\"link.left\" class=\"left-divider\"></span>\n" +
         "<i ng-if=\"link.icon\" class=\"{{link.icon}}\"></i>\n" +
         "<span>{{link.label || link.name}}</span>\n" +
         "<span ng-if=\"link.right\" class=\"right-divider\"></span></a>\n" +
         "\n"
            );

            $templateCache.put("lux/nav/templates/navbar.tpl.html",
                     "<nav ng-attr-id=\"{{navbar.id}}\" class=\"navbar navbar-{{navbar.themeTop}}\"\n" +
         "ng-class=\"{'navbar-fixed-top':navbar.fixed, 'navbar-static-top':navbar.top}\" role=\"navigation\">\n" +
         "    <div ng-class=\"navbar.container\">\n" +
         "        <div class=\"navbar-header\">\n" +
         "            <button ng-if=\"navbar.toggle\" type=\"button\" class=\"navbar-toggle\" ng-click=\"navbar.isCollapsed = !navbar.isCollapsed\">\n" +
         "                <span class=\"sr-only\">Toggle navigation</span>\n" +
         "                <span class=\"icon-bar\"></span>\n" +
         "                <span class=\"icon-bar\"></span>\n" +
         "                <span class=\"icon-bar\"></span>\n" +
         "            </button>\n" +
         "            <ul class=\"nav navbar-nav main-nav\">\n" +
         "                <li ng-if=\"navbar.itemsLeft\" ng-repeat=\"link in navbar.itemsLeft\" ng-class=\"{active:links.activeLink(link)}\" navbar-link>\n" +
         "                </li>\n" +
         "            </ul>\n" +
         "            <a ng-if=\"navbar.brandImage\" href=\"{{navbar.url}}\" class=\"navbar-brand\" target=\"{{navbar.target}}\">\n" +
         "                <img ng-src=\"{{navbar.brandImage}}\" alt=\"{{navbar.brand || 'brand'}}\">\n" +
         "            </a>\n" +
         "            <a ng-if=\"!navbar.brandImage && navbar.brand\" href=\"{{navbar.url}}\" class=\"navbar-brand\" target=\"{{navbar.target}}\">\n" +
         "                {{navbar.brand}}\n" +
         "            </a>\n" +
         "        </div>\n" +
         "        <nav class=\"navbar-collapse\" uib-collapse=\"navbar.isCollapsed\">\n" +
         "            <ul ng-if=\"navbar.items\" class=\"nav navbar-nav navbar-left\">\n" +
         "                <li ng-repeat=\"link in navbar.items\" ng-class=\"{active:links.activeLink(link)}\" navbar-link></li>\n" +
         "            </ul>\n" +
         "            <ul ng-if=\"navbar.itemsRight\" class=\"nav navbar-nav navbar-right\">\n" +
         "                <li ng-repeat=\"link in navbar.itemsRight\" ng-class=\"{active:links.activeLink(link)}\" navbar-link>\n" +
         "                </li>\n" +
         "            </ul>\n" +
         "        </nav>\n" +
         "    </div>\n" +
         "</nav>\n" +
         "\n"
            );

            $templateCache.put("lux/nav/templates/sidebar.tpl.html",
                     "<navbar class=\"sidebar-navbar\" ng-class=\"{'sidebar-open-left': navbar.left, 'sidebar-open-right': navbar.right}\"></navbar>\n" +
         "<aside ng-repeat=\"sidebar in sidebars\"\n" +
         "       class=\"sidebar sidebar-{{ sidebar.position }}\"\n" +
         "       ng-attr-id=\"{{ sidebar.id }}\"\n" +
         "       ng-class=\"{'sidebar-fixed': sidebar.fixed, 'sidebar-open': sidebar.open, 'sidebar-close': sidebar.closed}\" bs-collapse>\n" +
         "    <div class=\"nav-panel\">\n" +
         "        <div ng-if=\"sidebar.user\">\n" +
         "            <div ng-if=\"sidebar.user.avatar_url\" class=\"pull-{{ sidebar.position }} image\">\n" +
         "                <img ng-src=\"{{sidebar.user.avatar_url}}\" alt=\"User Image\" />\n" +
         "            </div>\n" +
         "            <div class=\"pull-left info\">\n" +
         "                <p>{{ sidebar.infoText }}</p>\n" +
         "                <a ng-attr-href=\"{{sidebar.user.username ? '/' + sidebar.user.username : '#'}}\">{{sidebar.user.name}}</a>\n" +
         "            </div>\n" +
         "        </div>\n" +
         "    </div>\n" +
         "    <ul class=\"sidebar-menu\">\n" +
         "        <li ng-if=\"section.name\" ng-repeat-start=\"section in sidebar.sections\" class=\"header\">\n" +
         "            {{section.name}}\n" +
         "        </li>\n" +
         "        <li ng-repeat-end ng-repeat=\"link in section.items\" class=\"treeview\"\n" +
         "        ng-class=\"{active:links.activeLink(link)}\" ng-include=\"'subnav'\"></li>\n" +
         "    </ul>\n" +
         "</aside>\n" +
         "<div class=\"sidebar-page\" ng-class=\"{'sidebar-open-left': navbar.left, 'sidebar-open-right': navbar.right}\" ng-click=\"closeSidebars()\">\n" +
         "    <div class=\"overlay\"></div>\n" +
         "</div>\n" +
         "\n" +
         "<script type=\"text/ng-template\" id=\"subnav\">\n" +
         "    <a ng-href=\"{{link.href}}\" ng-attr-title=\"{{link.title}}\" ng-click=\"sidebar.menuCollapse($event)\">\n" +
         "        <i ng-if=\"link.icon\" class=\"{{link.icon}}\"></i>\n" +
         "        <span>{{link.name}}</span>\n" +
         "        <i ng-if=\"link.subitems\" class=\"fa fa-angle-left pull-right\"></i>\n" +
         "    </a>\n" +
         "    <ul class=\"treeview-menu\" ng-class=\"{active:links.activeSubmenu(link)}\" ng-if=\"link.subitems\">\n" +
         "        <li ng-repeat=\"link in link.subitems\" ng-class=\"{active:links.activeLink(link)}\" ng-include=\"'subnav'\">\n" +
         "        </li>\n" +
         "    </ul>\n" +
         "</script>\n" +
         "\n"
            );

        }]);

});

define('lux/nav/navbar',['angular',
        'lux/main',
        'angular-animate',
        'angular-ui-bootstrap',
        'lux/nav/templates'], function (angular, lux) {
    'use strict';
    //
    //  Lux Navigation module
    //  ============================
    //
    //  Html:
    //
    //      <navbar data-options="lux.context.navbar"></navbar>
    //
    //  Js:
    //
    //      lux.context.navbar = {
    //          id: null,           //  id attribute of the nav tag
    //          brand: null,        //  brand text to be displayed
    //          brandImage: null    //  brand image to be displayed rather than text. If available
    //                              //  the `brand` text is placed in the `alt` attribute
    //          url: "/",           //  href of the brand (if brand is defined)
    //      };
    //
    angular.module('lux.nav', ['ui.bootstrap', 'lux.nav.templates', 'ngAnimate'])
        //
        .value('navBarDefaults', {
            collapseWidth: 768,
            theme: 'default',
            search_text: '',
            isCollapsed: false,
            // Navigation place on top of the page (add navbar-static-top class to navbar)
            // nabar2 it is always placed on top
            top: false,
            // Fixed navbar
            fixed: false,
            search: false,
            url: '/',
            target: '_self',
            toggle: true,
            fluid: true,
            template: 'lux/nav/templates/navbar.tpl.html'
        })
        //
        .value('navLinkTemplate', 'lux/nav/templates/link.tpl.html')

        .factory('navLinks', ['$location', function ($location) {

            return {
                click: click,
                activeLink: activeLink,
                activeSubmenu: activeSubmenu
            };

            function click (e, link) {
                if (link.action) {
                    var func = link.action;
                    if (func)
                        func(e, link.href, link);
                }
            }

            // Check if a url is active
            function activeLink (url) {
                var loc;
                if (url)
                // Check if any submenus/sublinks are active
                    if (url.subitems && url.subitems.length > 0) {
                        if (exploreSubmenus(url.subitems)) return true;
                    }
                url = angular.isString(url) ? url : url.href || url.url;
                if (!url) return;
                if (lux.isAbsolute.test(url))
                    loc = $location.absUrl();
                else
                    loc = $location.path();
                var rest = loc.substring(url.length),
                    base = url.length < loc.length ? false : loc.substring(0, url.length),
                    folder = url.substring(url.length - 1) === '/';
                return base === url && (folder || (rest === '' || rest.substring(0, 1) === '/'));
            }

            function activeSubmenu (url) {
                var active = false;

                if (url.href && url.href === '#' && url.subitems.length > 0) {
                    active = exploreSubmenus(url.subitems);
                } else {
                    active = false;
                }
                return active;
            }

            // recursively loops through arrays to
            // find url match
            function exploreSubmenus(array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].href === $location.path()) {
                        return true;
                    } else if (array[i].subitems && array[i].subitems.length > 0) {
                        if (exploreSubmenus(array[i].subitems)) return true;
                    }
                }
            }
        }])

        .factory('luxNavbar', ['navBarDefaults', '$window', function (navBarDefaults, $window) {

            function luxNavbar (opts) {
                var navbar = angular.extend({}, navBarDefaults, opts);

                if (!navbar.url)
                    navbar.url = '/';
                if (!navbar.themeTop)
                    navbar.themeTop = navbar.theme;
                navbar.container = navbar.fluid ? 'container-fluid' : 'container';

                luxNavbar.maybeCollapse(navbar);

                return navbar;
            }

            luxNavbar.template = function () {
                return navBarDefaults.template;
            };

            luxNavbar.maybeCollapse = function (navbar) {
                var width = $window.innerWidth > 0 ? $window.innerWidth : screen.width,
                    c = navbar.isCollapsed;

                navbar.isCollapsed = width < navbar.collapseWidth;
                return c !== navbar.isCollapsed;
            };

            luxNavbar.collapseForWide = function (navbar, element) {
                var width = $window.innerWidth > 0 ? $window.innerWidth : screen.width,
                    c = navbar.isCollapsed;

                if (width > navbar.collapseWidth || !navbar.isCollapsed) {
                    // If dropdown was opened then collapse
                    if (element.find('nav')[1].classList.contains('in'))
                        navbar.isCollapsed = true;
                }
                return c !== navbar.isCollapsed;
            };

            return luxNavbar;
        }])
        //
        .directive('fullPage', ['$window', function ($window) {

            return {
                restrict: 'AE',

                link: function (scope, element, attrs) {
                    var opts = angular.extend({}, scope.fullPage, lux.getOptions(attrs, 'fullPage')),
                        offset = +(opts.offset || 0),
                        height = $window.innerHeight - offset;
                    element.css('min-height', height + 'px');

                    scope.$watch(function () {
                        return $window.innerHeight - offset;
                    }, function (value) {
                        element.css('min-height', value + 'px');
                    });
                }
            };
        }])
        //
        .directive('navbarLink', ['navLinkTemplate', function (navLinkTemplate) {
            return {
                templateUrl: navLinkTemplate,
                restrict: 'A'
            };
        }])
        //
        //  Directive for the simple navbar
        //  This directive does not require the Navigation controller
        //      - items         -> Top left navigation
        //      - itemsRight    -> Top right navigation
        .directive('navbar', ['luxNavbar', 'navLinks', function (luxNavbar, navLinks) {
            //
            return {
                templateUrl: luxNavbar.template(),
                restrict: 'AE',
                link: navbar
            };
            //
            function navbar (scope, element, attrs) {

                var opts = angular.extend({}, scope.navbar, lux.getOptions(attrs, 'navbar'));

                scope.navbar = luxNavbar(opts);
                scope.links = navLinks;
                //
                lux.windowResize(function () {
                    if (luxNavbar.collapseForWide(scope.navbar, element))
                        scope.$apply();
                });
                //
                // When using ui-router, and a view changes collapse the
                //  navigation if needed
                scope.$on('$locationChangeSuccess', function () {
                    luxNavbar.maybeCollapse(scope.navbar);
                    //scope.$apply();
                });
            }
        }]);

});

define('lux/nav/sidebar',['angular',
        'lux/main',
        'lux/nav/navbar'], function (angular, lux) {
    'use strict';
    //
    //  Sidebar module
    //
    //  Include this module to render bootstrap sidebar templates
    //  The sidebar should be available as the ``sidebar`` object within
    //  the ``luxContext`` object:
    //
    //      luxContext.sidebar = {
    //          sections: [{
    //              name: 'Sec1',
    //              items: [{
    //                      name: 'i1',
    //                      icon: 'fa fa-dashboard',
    //                      subitems: []
    //               }]
    //          }]
    //      };
    //
    angular.module('lux.sidebar', ['lux.nav'])
        //
        .value('sidebarDefaults', {
            open: false,
            toggleName: 'Menu',
            url: lux.context.url || '/',
            infoText: 'Signed in as',
            template: 'lux/nav/templates/sidebar.tpl.html'
        })
        //
        .factory('luxSidebars', ['sidebarDefaults', function (sidebarDefaults) {

            function luxSidebars (element, opts) {
                opts || (opts = {});

                var sidebars = [];

                if (opts.left) add(opts.left, 'left');
                if (opts.right) add(opts.right, 'right');
                if (!sidebars.length) add(opts, 'left');

                return sidebars;

                // Add a sidebar (left or right position)
                function add(sidebar, position) {
                    sidebar = angular.extend({
                        position: position,
                        menuCollapse: menuCollapse}, sidebarDefaults, sidebar);

                    if (sidebar.sections) {
                        sidebars.push(sidebar);
                        return sidebar;
                    }
                }
            }

            luxSidebars.template = function () {
                return sidebarDefaults.template;
            };

            return luxSidebars;

            function menuCollapse ($event) {
                // Get the clicked link, the submenu and sidebar menu
                var item = angular.element($event.currentTarget || $event.srcElement),
                    submenu = item.next();

                // If the menu is not visible then close all open menus
                if (submenu.hasClass('active')) {
                    item.removeClass('active');
                    submenu.removeClass('active');
                } else {
                    var itemRoot = item.parent().parent();
                    itemRoot.find('ul').removeClass('active');
                    itemRoot.find('li').removeClass('active');

                    item.parent().addClass('active');
                    submenu.addClass('active');
                }
            }
        }])
        //
        //  Directive for the sidebar
        .directive('sidebar', ['$compile', 'luxSidebars', 'luxNavbar', 'navLinks',
            '$templateCache', '$window', '$timeout',
            function ($compile, luxSidebars, luxNavbar, navLinks,
                      $templateCache, $window, $timeout) {
                //
                var inner;

                return {
                    restrict: 'AE',
                    compile: function (element) {
                        inner = element.html();

                        element.html('');

                        return {
                            pre: sidebar,
                            post: finalise
                        };
                    }
                };

                function sidebar(scope, element, attrs) {
                    var options = lux.getOptions(attrs, 'sidebar'),
                        sidebar = angular.extend({}, scope.sidebar, options),
                        navbar = luxNavbar(angular.extend({}, sidebar.navbar, options.navbar)),
                        template;

                    navbar.top = true;
                    navbar.fluid = true;
                    scope.navbar = navbar;
                    var sidebars = luxSidebars(element, sidebar);

                    if (sidebars.length) {
                        scope.sidebars = sidebars;
                        scope.closeSidebars = closeSidebars;
                        //
                        // Add toggle to the navbar
                        lux.forEach(sidebars, function (sidebar) {
                            addSidebarToggle(sidebar, scope);
                        });
                        //
                        template = $templateCache.get(luxSidebars.template());
                    } else
                        template = $templateCache.get(luxNavbar.template());

                    scope.links = navLinks;

                    element.append($compile(template)(scope));

                    if (inner) {
                        inner = $compile(inner)(scope);

                        if (sidebars.length)
                            lux.querySelector(element, '.sidebar-page').append(inner);
                        else
                            element.after(inner);
                    }

                    function closeSidebars () {
                        angular.forEach(sidebars, function (sidebar) {
                            sidebar.close();
                        });
                    }
                }

                function finalise(scope, element) {
                    var triggered = false;

                    $timeout(function () {
                        return element.find('nav');
                    }).then(function (nav) {

                        angular.element($window).bind('scroll', function () {

                            if ($window.pageYOffset > 150 && triggered === false) {
                                nav.addClass('navbar--small');
                                triggered = true;
                                scope.$apply();
                            } else if ($window.pageYOffset <= 150 && triggered === true) {
                                nav.removeClass('navbar--small');
                                triggered = false;
                                scope.$apply();
                            }

                        });
                    });
                }
            }]);

        //
        //  Add toggle functionality to sidebar
        function addSidebarToggle (sidebar, scope) {
            if (!sidebar.toggleName) return;

            sidebar.close = function () {
                setState(false);
            };

            function toggle (e) {
                e.preventDefault();
                angular.forEach(scope.sidebars, function (s) {
                    if (s != sidebar) s.close();
                });
                setState(!sidebar.open);
            }

            function setState (value) {
                sidebar.open = value;
                sidebar.closed = !value;
                scope.navbar[sidebar.position] = sidebar.open;
            }

            var item = {
                href: sidebar.position,
                title: sidebar.toggleName,
                name: sidebar.toggleName,
                klass: 'sidebar-toggle',
                icon: 'fa fa-bars',
                action: toggle,
                right: 'vert-divider'
            };

            if (sidebar.position === 'left') {
                if (!scope.navbar.itemsLeft) scope.navbar.itemsLeft = [];
                scope.navbar.itemsLeft.splice(0, 0, item);
            } else {
                if (!scope.navbar.itemsRight) scope.navbar.itemsRight = [];
                scope.navbar.itemsRight.push(item);
            }
        }
});

define('lux/nav/main',['lux/main',
        'lux/nav/navbar',
        'lux/nav/sidebar'], function (lux) {
    'use strict';

    return lux;
});

define('lux/page/templates',['angular'], function (angular) {
    "use strict";

    angular.module('lux.page.templates', [])
        .run(["$templateCache", function ($templateCache) {

            $templateCache.put("lux/page/templates/breadcrumbs.tpl.html",
                     "<ol class=\"breadcrumb\">\n" +
         "    <li ng-repeat=\"step in steps\" ng-class=\"{active: step.last}\">\n" +
         "        <a ng-if=\"!step.last\" href=\"{{step.href}}\">{{step.label}}</a>\n" +
         "        <span ng-if=\"step.last\">{{step.label}}</span>\n" +
         "    </li>\n" +
         "</ol>\n"
            );

            $templateCache.put("lux/page/templates/list-group.tpl.html",
                     "<div class=\"list-group\">\n" +
         "  <a ng-repeat=\"link in links\" ng-href=\"{{link.html_url}}\" class=\"list-group-item\"\n" +
         "  ng-bind=\"link.title\" ng-class=\"{active: link.html_url === $location.absUrl()}\"></a>\n" +
         "</div>\n" +
         "\n"
            );

        }]);

});

define('lux/page/page',['angular',
        'lux/main',
        'lux/page/templates'], function (angular, lux) {
    'use strict';
    //
    //  Lux Page
    //  ==============
    //
    //  Design to work with the ``lux.extension.angular``
    angular.module('lux.page', ['lux.page.templates'])
        //
        .run(['context', function (context) {

            if (!context.linksTemplate)
                context.linksTemplate = 'lux/page/templates/list-group.tpl.html';

            if (!context.breadcrumbsTemplate)
                context.breadcrumbsTemplate = 'lux/page/templates/breadcrumbs.tpl.html';
        }])
        //
        .factory('pageInfo', ['$window', '$lux', '$document', 'dateFilter',
            function ($window, $lux, $document, dateFilter) {

                function pageInfo (page, scope) {
                    // If the page is a string, retrieve it from the pages object
                    if (angular.isString(scope.page))
                        angular.extend(page, scope.pages ? scope.pages[page] : null);

                    if (page.author) {
                        if (angular.isArray(page.author))
                            page.authors = page.author.join(', ');
                        else
                            page.authors = page.author;
                    }

                    if (page.date) {
                        try {
                            page.date = new Date(page.date);
                            page.dateText = dateFilter(page.date, scope.dateFormat);
                        } catch (e) {
                            $lux.log.error('Could not parse date');
                        }
                    }

                    page.path = $window.location.pathname;

                    return page;
                }

                return pageInfo;
            }
        ])
        //
        .controller('LuxPageController', ['$rootScope', '$lux', 'pageInfo',
            function (scope, $lux, pageInfo) {
                var vm = this;
                //
                $lux.log.info('Setting up page');
                //
                pageInfo(vm, scope);
            }
        ])

        .factory('luxBreadcrumbs', ['$window', function ($window) {

            return function () {
                var loc = $window.location,
                    path = loc.pathname,
                    steps = [],
                    last = {
                        href: loc.origin
                    };
                if (last.href.length >= lux.context.url.length)
                    steps.push(last);

                path.split('/').forEach(function (name) {
                    if (name) {
                        last = {
                            label: name.split(/[-_]+/).map(lux.capitalize).join(' '),
                            href: lux.joinUrl(last.href, name)
                        };
                        if (last.href.length >= lux.context.url.length)
                            steps.push(last);
                    }
                });
                if (steps.length) {
                    last = steps[steps.length - 1];
                    if (path.substring(path.length - 1) !== '/' && last.href.substring(last.href.length - 1) === '/')
                        last.href = last.href.substring(0, last.href.length - 1);
                    last.last = true;
                    steps[0].label = 'Home';
                }
                return steps;
            };
        }])
        //
        //  Directive for displaying breadcrumbs navigation
        .directive('breadcrumbs', ['$rootScope', 'luxBreadcrumbs', 'context',
            function ($rootScope, luxBreadcrumbs, context) {
                return {
                    restrict: 'AE',
                    replace: true,
                    templateUrl: context.breadcrumbsTemplate,
                    link: {
                        post: function (scope) {

                            var regCrumbs = $rootScope.$on('$viewContentLoaded', crumbs);
                            scope.$on('$destroy', regCrumbs);

                            crumbs();

                            function crumbs () {
                                scope.steps = luxBreadcrumbs();
                            }
                        }
                    }
                };
            }]
        )
        //
        //  Simply display the current year
        .directive('year', [function () {
            return {
                restrict: 'AE',
                link: function (scope, element) {
                    var dt = new Date();
                    element.html(dt.getFullYear() + '');
                }
            };
        }])
        //
        //
        // Display a div with links to content
        .directive('cmsLinks', ['$lux', '$location', 'context',
            function ($lux, $location, context) {

                return {
                    restrict: 'AE',
                    link: function (scope, element, attrs) {
                        var config = lux.getObject(attrs, 'config', scope),
                            http = $lux.http;

                        scope.$location = $location;
                        if (config.url) {
                            http.get(config.url).then(function (response) {
                                scope.links = response.data.result;
                                $lux.renderTemplate(context.linksTemplate, element, scope, scrollspy);
                            }, function () {
                                $lux.messages.error('Could not load links');
                            });
                        }

                        function scrollspy () {
                            // if (config.hasOwnProperty('scrollspy'))
                            //    $scrollspy(element);
                        }
                    }
                };

            }]
        );

});

define('lux/page/main',['angular',
        'lux/main',
        'lux/page/page'], function (angular, lux) {
    'use strict';
    //
    //	Lux.router
    //	===================
    //
    //	Drop in replacement for lux.ui.router when HTML5_NAVIGATION is off.
    //
    angular.module('lux.router', ['lux.page'])
        //
        .config(['$locationProvider', function ($locationProvider) {
            //
            // Enable html5mode but set the hash prefix to something different from #
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false,
                rewriteLinks: false
            }).hashPrefix("#");
        }]);

    return lux;
});

define('lux/pagination/templates',['angular'], function (angular) {
    "use strict";

    angular.module('lux.pagination.templates', [])
        .run(["$templateCache", function ($templateCache) {

            $templateCache.put("lux/pagination/templates/horizontal.tpl.html",
                     "<ul class=\"pagination pagination-sm\">\n" +
         "    <li ng-class=\"pagination.prevPageDisabled()\">\n" +
         "        <a ng-click=\"pagination.gotoPage(1)\">&laquo;</a>\n" +
         "    </li>\n" +
         "    <li ng-class=\"pagination.prevPageDisabled()\">\n" +
         "        <a ng-click=\"pagination.prevPage()\">&lsaquo;</a>\n" +
         "    </li>\n" +
         "    <li ng-repeat=\"pageNumber in pagination.pages track by pagination.tracker(pageNumber, $index)\"\n" +
         "        ng-class=\"{active: pageNumber == pagination.current, disabled : pageNumber == '...' }\"\n" +
         "        ng-click=\"pagination.gotoPage(pageNumber)\">\n" +
         "        <a>{{pageNumber}}</a>\n" +
         "    </li>\n" +
         "\n" +
         "    <li ng-class=\"pagination.nextPageDisabled()\">\n" +
         "        <a ng-click=\"pagination.nextPage()\">&rsaquo;</a>\n" +
         "    </li>\n" +
         "    <li ng-class=\"pagination.nextPageDisabled()\">\n" +
         "        <a ng-click=\"pagination.gotoPage(pagination.last)\">&raquo;</a>\n" +
         "    </li>\n" +
         "</ul>\n" +
         "\n"
            );

            $templateCache.put("lux/pagination/templates/infinite.tpl.html",
                     "<div class=\"pagination infinite\" infinite-scroll-distance=\"pagination.scrollDistance\" infinite-scroll='pagination.nextPage()' infinite-scroll-disabled='pagination.paused()'>\n" +
         "    <div class=\"loading\" ng-show='pagination.busy'>\n" +
         "        <i class=\"fa fa-spinner\"></i> Loading {{pagination.displayLoadingName}}...\n" +
         "    </div>\n" +
         "    <button class=\"btn btn-default btn-sm show-more\"\n" +
         "            ng-click=\"pagination.loadMore()\"\n" +
         "            ng-hide=\"pagination.isLoadMoreHidden()\">\n" +
         "        Load more\n" +
         "    </button>\n" +
         "</div>\n" +
         "\n"
            );

        }]);

});

define('lux/pagination/horizontal',['angular',
        'lux/main'], function(angular) {
    'use strict';

    /**
     * Horizontal pagination module
     *
     *   Usage:
     *      <pagination data-url="/users" data-limit="6">
     *          <ul>
     *              <li ng-repeat="item in pagination.items">
     *                 <span>{{item}}</span>
     *              </li>
     *          </ul>
     *      </pagination>
     */
    angular.module('lux.pagination.horizontal', [])
        /**
         * Default opitons
         */
        .constant('horizontalDefaults', {
            'limit': 5,
            'templateUrl': 'lux/pagination/templates/horizontal.tpl.html'
        })
        /**
         * Factory to handle horizontal pagination
         *
         * @param $lux
         * @param horizontalDefaults
         */
        .factory('HorizontalPagination', ['$lux', 'horizontalDefaults', function($lux, horizontalDefaults) {
            var HorizontalPagination = function(config) {
                this.items = [];
                this.total = 0;
                this.current = 1;
                this.last = 1;
                this.pages = [];
                this.maxRange = 8;
                this.luxApi = $lux.api(config.API_URL);
                angular.extend(this, horizontalDefaults, config);
            };

            /**
             * Given the position in the sequence of pagination links [i], figure out what page number corresponds to that position
             *
             * @param i
             * @param currentPage
             * @param paginationRange
             * @param totalPages
             * @return {*}
             */
            HorizontalPagination.prototype.calculatePageNumber = function(i, currentPage, paginationRange, totalPages) {
                var halfWay = Math.ceil(paginationRange/2);

                if (i === paginationRange)
                    return totalPages;

                if (i === 1)
                    return i;

                if (paginationRange < totalPages) {
                    if (totalPages - halfWay < currentPage)
                        return totalPages - paginationRange + i;

                    if (halfWay < currentPage)
                        return currentPage - halfWay + i;
                }
                return i;
            };

            /**
             * Generate an array of page number (or the '...' string). It is used in an ng-repeat to generate the links for pages.
             *
             * @param currentPage
             * @param collectionLength
             * @param rowsPerPage
             * @param paginationRange
             * @returns {Array}
             */
            HorizontalPagination.prototype.generatePages = function(currentPage, collectionLength, rowsPerPage, paginationRange) {
                var pages = [];
                var totalPages = Math.ceil(collectionLength / rowsPerPage);
                var halfWay = Math.ceil(paginationRange / 2);
                var ellipsesNeeded = paginationRange < totalPages;
                var position;

                if (currentPage <= halfWay)
                    position = 'start';
                else if (totalPages - halfWay < currentPage)
                    position = 'end';
                else
                    position = 'middle';

                var i = 1;
                while (i <= totalPages && i <= paginationRange) {
                    var pageNumber = this.calculatePageNumber(i, currentPage, paginationRange, totalPages);
                    var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
                    var closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));

                    if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded))
                        pages.push('...');
                    else
                        pages.push(pageNumber);

                    ++i;
                }
                return pages;
            };

            /**
             * Custom "track by" function which allows for duplicate "..." entries on long lists
             *
             * @param id
             * @param index
             * @returns {string}
             */
            HorizontalPagination.prototype.tracker = function(id, index) {
                return id + '_' + index;
            };

            /**
             * Called as the first function to fetch initial items from API
             */
            HorizontalPagination.prototype.init = function() {
                this.getItems();
            };

            /**
             * Called when page number was changed to get more data
             */
            HorizontalPagination.prototype.getItems = function() {
                var offset = parseInt(this.limit * (this.current - 1));
                this.items = [];

                this.luxApi.get({path: this.targetUrl}, {limit: parseInt(this.limit), offset: offset}).then(function(resp) {
                    this.total = resp.data.total;
                    this.last = this.getPageNumbers();

                    var items = resp.data.result;
                    for (var i = 0; i < items.length; i++)
                        this.items.push(items[i]);

                    this.pages = this.generatePages(this.current, this.total, this.limit, this.maxRange);

                }.bind(this));
            };

            /**
             * Calculates total number of pages
             *
             * @returns {number}
             */
            HorizontalPagination.prototype.getPageNumbers = function() {
                return Math.ceil(this.total/this.limit);
            };

            /**
             * Called when we change page number
             *
             * @param pageNumber
             */
            HorizontalPagination.prototype.gotoPage = function(pageNumber) {
                if (pageNumber === this.current) return;

                if (pageNumber >= 1 && pageNumber <= this.getPageNumbers()) {
                    this.current = pageNumber;
                    this.getItems();
                }
            };

            /**
             * Called when we go to the next page
             */
            HorizontalPagination.prototype.nextPage = function() {
                if (this.current < this.getPageNumbers()) {
                    ++this.current;
                    this.getItems();
                }
            };

            /**
             * Called when we go to the previous page
             */
            HorizontalPagination.prototype.prevPage = function() {
                if (this.current > 1) {
                    --this.current;
                    this.getItems();
                }
            };

            /**
             * Checks if the next page is disabled
             *
             * @returns {boolean}
             */
            HorizontalPagination.prototype.nextPageDisabled = function() {
                return this.current === this.getPageNumbers() ? 'disabled' : '';
            };

            /**
             * Checks if the previous page is disabled
             *
             * @returns {boolean}
             */
            HorizontalPagination.prototype.prevPageDisabled = function() {
                return this.current === 1 ? 'disabled' : '';
            };

            return HorizontalPagination;
        }]);
});

define('lux/pagination/infinite',['angular',
        'lux/main'], function(angular) {
    'use strict';

    /**
     * Infinite pagination module
     *
     *   Usage:
     *      <pagination data-type="infinite"
     *                  data-scroll-distance="1"
     *                  data-load-more-button="true"
                        data-display-loading-name="datasets"
     *                  data-url="/users"
     *                  data-limit="6">
     *          <ul>
     *              <li ng-repeat="item in pagination.items">
     *                 <span>{{item}}</span>
     *              </li>
     *          </ul>
     *      </pagination>
     */
    angular.module('lux.pagination.infinite', ['infinite-scroll'])
        /**
         * Default options
         */
        .constant('infiniteDefaults', {
            'loadMoreButton': {
                enabled: true,
                clicked: false
            },
            'limit': 5,
            'scrollDistance': 0,
            'templateUrl': 'lux/pagination/templates/infinite.tpl.html'
        })
        //
        .value('THROTTLE_MILLISECONDS', 400)
        /**
         * Factory to handle infinite pagination
         *
         * @param $lux
         * @param infiniteDefaults
         */
        .factory('InfinitePagination', ['$lux', 'infiniteDefaults', function($lux, infiniteDefaults) {
            var InfinitePagination = function(config) {
                this.items = [];
                this.busy = false;
                this.offset = 0;
                this.total = null;
                this.luxApi = $lux.api(config.API_URL);
                angular.extend(this, infiniteDefaults, config);
                if (!this.scrollDistance) {
                    this.scrollDistance = infiniteDefaults.scrollDistance;
                }
            };

            /**
             * Called as the first function to fetch initial items from API
             */
            InfinitePagination.prototype.init = function() {
                this.nextPage();
            };

            /**
             * Called when click load more button
             */
            InfinitePagination.prototype.loadMore = function() {
                this.loadMoreButton.clicked = true;
                this.nextPage();
                this.loadMoreButton.clicked = false;
            };

            /**
             * Checking whether data was downloaded
             *
             * @returns {boolean}
             */
            InfinitePagination.prototype.isLoadDone = function() {
                return (this.total && this.items.length === this.total);
            };

            InfinitePagination.prototype.isLoadMoreHidden = function() {
                return !this.loadMoreButton.enabled || this.loadMoreButton.clicked || this.isLoadDone();
            };

            /**
             * Prevents to do more API calls at the same time
             *
             * @returns {boolean}
             */
            InfinitePagination.prototype.paused = function() {
                return this.busy || this.isLoadDone();
            };

            /**
             * Called when more data is being loaded
             */
            InfinitePagination.prototype.nextPage = function() {
                if (this.paused())
                    return;

                if (this.loadMoreButton.enabled) {
                    var isFirstLoad = (this.total === null);

                    if (!isFirstLoad && !this.loadMoreButton.clicked)
                        return;
                }

                this.busy = true;

                this.luxApi.get({path: this.targetUrl}, {limit: parseInt(this.limit), offset: parseInt(this.items.length)}).then(function(resp) {
                    this.total = resp.data.total;

                    var items = resp.data.result;
                    for (var i = 0; i < items.length; i++)
                        this.items.push(items[i]);

                    this.busy = false;
                }.bind(this));
            };

            return InfinitePagination;
        }]);
});

define('lux/pagination/main',['angular',
        'lux/services/pagination',
        'lux/pagination/templates',
        'lux/pagination/horizontal',
        'lux/pagination/infinite',
        'angular-infinite-scroll'], function(angular) {
    'use strict';

    /**
     * Pagination module
     *
     */
    angular.module('lux.pagination', ['lux.pagination.templates', 'lux.pagination.horizontal', 'lux.pagination.infinite'])
        /**
         * Directive to handle pagination. It gets data from API via $lux service.
         * Allows to use two types of pagination: horizontal (classic) and infinite (scroll)
         *
         * @params $compile
         * @params $templateCache
         * @params $injector
         */
        .directive('luxPagination', ['$compile', '$templateCache', '$injector', function($compile, $templateCache, $injector) {
            return {
                restrict: 'E',
                transclude: true,
                scope: false,
                link: function(scope, element, attrs, ctrl, transcludeFn) {
                    var template,
                        PaginationService,
                        config = {
                            targetUrl: attrs.url,
                            limit: attrs.limit,
                            loadMoreButton: {
                                enabled: (attrs.loadMoreButton === 'true') || false
                            },
                            // displayLoadingName is displayed as `Loading <displayLoadingName> ...`
                            displayLoadingName: (attrs.displayLoadingName) || 'data',
                            scrollDistance: (attrs.scrollDistance) || false,
                            API_URL: scope.API_URL
                        };

                    if (attrs.limit)
                        config.limit = attrs.limit;

                    if (attrs.type === 'infinite')
                        PaginationService = $injector.get('InfinitePagination');
                    else
                        PaginationService = $injector.get('HorizontalPagination');

                    scope.pagination = new PaginationService(config);
                    scope.pagination.init();
                    template = $templateCache.get(scope.pagination.templateUrl);

                    // First we append transcluded content
                    var transContent = transcludeFn();
                    element.append(transContent);

                    // Then we can add pagination template
                    element.append($compile(template)(scope));
                }
            };
        }]);
});

define('lux/components/highlight',['angular',
        'lux/main'], function (angular, lux) {
    'use strict';

    var root = lux.root;
    //
    //  Code highlighting with highlight.js
    //
    //  This module is added to the blog module so that the highlight
    //  directive can be used. Alternatively, include the module in the
    //  module to be bootstrapped.
    //
    //  Note:
    //      MAKE SURE THE lux.extensions.code EXTENSIONS IS INCLUDED IN
    //      YOUR CONFIG FILE
    angular.module('lux.highlight', [])

        .directive('luxHighlight', ['$rootScope', '$log', function ($rootScope, log) {
            return {
                link: function link(scope, element) {
                    log.info('Highlighting code');
                    highlight(element);
                }
            };
        }]);

    var highlight = function (elem) {
        require(['highlight'], function () {
            angular.forEach(angular.element(elem)[0].querySelectorAll('code'), function (block) {
                var elem = angular.element(block),
                    parent = elem.parent();
                if (lux.isTag(parent, 'pre')) {
                    root.hljs.highlightBlock(block);
                    parent.addClass('hljs');
                } else {
                    elem.addClass('hljs inline');
                }
            });
            // Handle sphinx highlight
            angular.forEach(angular.element(elem)[0].querySelectorAll('.highlight pre'), function (block) {
                var elem = angular.element(block).addClass('hljs'),
                    div = elem.parent(),
                    p = div.parent();
                if (p.length && p[0].className.substring(0, 10) === 'highlight-')
                    div[0].className = 'language-' + p[0].className.substring(10);
                root.hljs.highlightBlock(block);
            });

        });
    };

});

require([
    'js/require.config',
    'angular',
    'giotto',
    'crossfilter',
    'js/colorbrewer',
    'js/data',
    'js/quandl',
    'js/eurostat',
    'lux/forms/main',
    'lux/nav/main',
    'lux/page/main',
    'lux/pagination/main',
    'lux/components/highlight',
    'angular-sanitize'
], function(lux, angular, d3, crossfilter, colorbrewer) {
    'use strict';

    //
    // Inject colorBrewer
    d3.colorbrewer = colorbrewer;
    d3.quant.crossfilterSerie.crossfilter = crossfilter;
    lux.root.d3 = d3;

    // Ceate giotto angular module
    d3.angularModule(angular);

    //
    // Main angular module for giottojs
    angular.module('giottojs.main', [
        'lux.sidebar',
        'lux.form',
        'lux.router',
        'lux.highlight',
        'lux.pagination',
        'giotto',
        'giottojs.data'])
        .constant('giottojsNavigation', {
            brand: 'GiottoJS',
            brandImage: lux.media('giottojs/giotto-banner.svg'),
            top: true,
            fixed: true,
            target: '_self',
            itemsRight: [
                {
                    href: '/examples',
                    icon: 'fa fa-bar-chart',
                    label: 'examples',
                    target: '_self'
                },
                {
                    href: '/api',
                    icon: 'fa fa-cogs',
                    label: 'api'
                },
                {
                    href: 'https://github.com/quantmind/giotto',
                    icon: 'fa fa-github'
                }
            ]
        })
        .config(['giottoDefaults', function (giottoDefaults) {
            giottoDefaults.contextMenu = [];
        }])
        .run(['$rootScope', '$lux', 'context', 'giottojsNavigation',
            function ($scope, $lux, context, giottojsNavigation) {
                $scope.navbar = giottojsNavigation;
            }]
        );

    lux.bootstrap('giottojs', ['giottojs.main']);
});

define("js/main", function(){});

