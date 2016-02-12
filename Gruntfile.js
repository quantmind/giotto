/*eslint-env node */
module.exports = function(grunt) {
    'use strict';

    var srcPath = 'src',
        config_file = 'config.json',
        cfg = grunt.file.readJSON(config_file),
        path = require('path'),
        _ = require('lodash'),
        baseTasks = [],
        jsTasks = [],
        cssTasks = [],
        // These entries are tasks configurators not libraries
        skipEntries = ['options', 'watch'],
        requireOptions = {
            baseUrl: srcPath + '/',
            // TODO change to true when Chrome sourcemaps bug is fixed
            generateSourceMaps: false,
            optimize: 'none',
            name: 'app',
            out: srcPath + '/build/bundle.js',
            paths: _.reduce(cfg.thirdParty, function (obj, el) {
                obj[el] = 'empty:';
                return obj;
            }, {})
        },
        rollupPlugins = {
            babel: "rollup-plugin-babel",
            nodeResolve: "rollup-plugin-node-resolve"
        },
        // Defaults for cobertura
        cobertura = {
            includeAllSources: true,
            reporters: [
                {
                    "subdir": ".",
                    "type": "cobertura",
                    "dir": "coverage/"
                },
                {
                    subdir: '.',
                    type: 'lcovonly',
                    dir: 'coverage/'
                },
                {
                    type: 'text-summary'
                }
            ]
        };

    //
    //  Configuration for lux.js
    if (cfg.useLux) {
        baseTasks = ['shell:buildLuxConfig', 'luxbuild'];
        // Extend shell tasks with lux configuration tasks
        cfg.shell = _.extend({
            buildLuxConfig: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: function () {
                    return path.resolve('manage.py') + ' media';
                }
            },
            buildPythonCSS: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: function () {
                    return path.resolve('manage.py') + ' style --cssfile ' + path.resolve('scss/deps/py.lux');
                }
            }
        }, cfg.shell);
        //
        grunt.registerTask('luxbuild', 'Load lux configuration', function() {
            var paths = cfg.requirejs.compile.options.paths,
                filename = srcPath + '/build/lux.json',
                obj = grunt.file.readJSON(filename);
            _.extend(paths, obj.paths);
        });
    }

    cfg.pkg = grunt.file.readJSON('package.json');
    //
    // Extend clean tasks with standard cleanup duties
    cfg.clean = _.extend({
        js: {
            src: [srcPath + '/build']
        },
        css: {
            src: ['scss/deps']
        },
        test: {
            src: ['coverage', 'junit']
        }
    }, cfg.clean);

    //
    //  JS tasks
    //  -----------------------
    //  Tasks are loaded only if specified in the cfg
    //
    //  ESLINT
    if (cfg.eslint) {
        if (!cfg.eslint.options)
            cfg.eslint.options = {
                quiet: true
            };
        grunt.loadNpmTasks('grunt-eslint');
        jsTasks.push('eslint');
    }
    //
    //  HTML2JS
    if (cfg.html2js) {
        grunt.loadNpmTasks('grunt-html2js');
        jsTasks.push('html2js');
    }
    //
    // REQUIREJS
    if (cfg.requirejs) {
        grunt.loadNpmTasks('grunt-contrib-requirejs');
        jsTasks.push('requirejs');
        _.forOwn(cfg.requirejs, function (value, name) {
            cfg.requirejs[name] = _.extend({}, requireOptions, value);
        });
    }
    //
    //  HTTP
    if (cfg.http) {
        grunt.loadNpmTasks('grunt-http');
        jsTasks.push('http');
    }
    //
    //  COPY
    if (cfg.copy) {
        grunt.loadNpmTasks('grunt-contrib-copy');
        jsTasks.push('copy');
    }
    //
    //  ROLLUP
    if (cfg.rollup) {
        var rollup = cfg.rollup.options;
        if (rollup) {
            var plugins = [];
            _.forOwn(rollup.plugins, function(options, name) {
                var plugin = require(rollupPlugins[name]);
                grunt.log.debug('Adding ' + name + ' rollup plugin');
                plugins.push(plugin(options));
            });
            rollup.plugins = plugins;
        }
        grunt.loadNpmTasks('grunt-rollup');
        jsTasks.push('rollup');
    }
    //
    // CONCAT
    if (cfg.concat) {
        // Preprocess Javascript jslibs
        _.forOwn(cfg.concat, function(value, name) {
            var options = value.options;
            if (options && options.banner) {
                options.banner = grunt.file.read(options.banner);
            }
            add_watch(cfg.concat, name, jsTasks);
        });
        cfg.uglify = _.extend(uglify_jslibs(cfg.concat), cfg.uglify);
        grunt.loadNpmTasks('grunt-contrib-concat');
        jsTasks.push('concat');
    }
    //
    // UGLIFY
    if (cfg.uglify) {
        grunt.loadNpmTasks('grunt-contrib-uglify');
        jsTasks.push('uglify');
    }


    // Add initial tasks
    jsTasks = baseTasks.concat(jsTasks);

    var buildTasks = [].concat(jsTasks),
        testTasks = baseTasks.concat(['karma:dev']);
    //
    //  Build CSS if required
    //  --------------------------
    //
    //  When the ``sass`` key is available in config, add the necessary tasks
    if (cfg.sass) {
        grunt.log.debug('Adding sass configuration');

        _.forOwn(cfg.sass, function(value, key) {
            if (skipEntries.indexOf(key) < 0) cssTasks.push('sass:' + key);
        });

        if (cssTasks.length) {
            grunt.loadNpmTasks('grunt-sass');
            if (cfg.useLux)
                cssTasks = ['shell:buildPythonCSS'].concat(cssTasks);

            if (!cfg.sass.options) cfg.sass.options = {
                sourceMap: true,
                sourceMapContents: true,
                includePaths: [path.join(__dirname, 'node_modules')]
            };

            // Add watch for sass files
            add_watch(cfg, 'sass', ['css']);

            if (cfg.cssmin) {
                grunt.loadNpmTasks('grunt-contrib-cssmin');

                _.forOwn(cfg.cssmin, function(value, key) {
                    if (skipEntries.indexOf(key) < 0) cssTasks.push('cssmin:' + key);
                });

                if (!cfg.cssmin.options) cfg.cssmin.options = {
                    shorthandCompacting: false,
                    roundingPrecision: -1,
                    sourceMap: true,
                    sourceMapInlineSources: true
                };
            }

            var buildCss = baseTasks.concat(cssTasks);
            buildTasks = buildTasks.concat(cssTasks);
            grunt.registerTask('css', 'Compile python and sass styles', buildCss);
        }
    }

    // Karma
    if (cfg.karma) {
        grunt.loadNpmTasks('grunt-karma');
        _.forOwn(cfg.karma, function(value, key) {
            if (skipEntries.indexOf(key) < 0) {
                if (value.coverageReporter)
                    value.coverageReporter = _.extend(value.coverageReporter, cobertura);
            }
        });
    }

    if (cfg.shell) grunt.loadNpmTasks('grunt-shell');
    //
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    //
    grunt.registerTask('test', testTasks);
    grunt.registerTask('js', 'Compile and lint javascript libraries', jsTasks);
    grunt.registerTask('build', 'Compile and lint javascript and css libraries', buildTasks);
    grunt.registerTask('all', 'Compile lint and test all libraries', ['build', 'test']);
    grunt.registerTask('default', ['build', 'karma:ci']);
    //
    grunt.initConfig(cfg);
    //
    //
    // Add a watch entry to ``cfg``
    function add_watch(obj, name, tasks) {
        var src = obj[name],
            watch = src ? src.watch : null;
        if (watch) {
            grunt.log.debug('Adding watch configuration for ' + name);
            delete src.watch;
            if (!cfg.watch) cfg.watch = {
                options: {
                    atBegin: true,
                    // Start a live reload server on the default port 35729
                    livereload: true
                }
            };
            if (!watch.files)
                watch = {files: watch};
            cfg.watch[name] = watch;
            if (!watch.tasks) {
                watch.tasks = tasks;
            }
        }
    }
    //
    function uglify_jslibs(concat) {
        var result = {};
        _.forOwn(concat, function(value, name) {
            if (name !== 'options' && value.minify !== false) {
                result[name] = {
                    dest: value.dest.replace('.js', '.min.js'),
                    src: [value.dest],
                    options: {
                        sourceMap: false, // TODO change to true when Chrome sourcemaps bug is fixed
                        sourceMapIn: value.dest + '.map',
                        sourceMapIncludeSources: false // TODO change to true when Chrome sourcemaps bug is fixed
                    }
                };
            }
        });
        return result;
    }
};
