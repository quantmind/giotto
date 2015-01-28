/*jshint node: true */
/*global config:true, task:true, process:true*/
module.exports = function (grunt) {
  "use strict";
    // Project configuration.
    var docco_output = '../docs/lux/html/docco',
        //docco_output = 'docs/build/html/docco',
        // All libraries
        libs = grunt.file.readJSON('files.json'),
        concats = {};
    //
    function for_each(obj, callback) {
        for(var p in obj) {
            if(obj.hasOwnProperty(p)) {
                callback.call(obj[p], p);
            }
        }
    }
    //
    // Preprocess libs
    for_each(libs, function (name) {
        var options = this.options;
        if(options && options.banner) {
            options.banner = grunt.file.read(options.banner);
        }
        if (this.dest)
            concats[name] = this;
    });
    //
    function uglify_libs () {
        var result = {};
        for_each(concats, function (name) {
            if (this.minify !== false)
                result[name] = {dest: this.dest.replace('.js', '.min.js'),
                                src: [this.dest]};
        });
        return result;
    }
    //
    // js hint all libraries
    function jshint_libs () {
        var result = {
                gruntfile: "Gruntfile.js",
                options: {
                    browser: true,
                    expr: true,
                    globals: {
                        requirejs: true,
                        require: true,
                        exports: true,
                        console: true,
                        DOMParser: true,
                        Showdown: true,
                        module: true,
                        ok: true,
                        equal: true,
                        test: true,
                        asyncTest: true,
                        start: true
                    }
                }
        };
        for_each(libs, function (name) {
            result[name] = this.dest || this.src;
        });
        return result;
    }
    //
    // This Grunt Config Entry
    // -------------------------------
    //
    // Initialise Grunt with all tasks defined above
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        str2js: {
            NS: { 'src/text/text.js': ['src/text/giotto.min.css']}
        },
        concat: concats,
        uglify: uglify_libs(),
        jshint: jshint_libs(),
        jasmine: {
            test: {
                src : 'dist/giotto.min.js',
                options : {
                    specs : 'src/tests/*.js',
                    template: 'src/tests/test.tpl.html'
                }
            },
            coverage: {
                src : 'dist/giotto.js',
                options : {
                    specs : 'src/tests/*.js',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/coverage.json',
                        report: [
                            {
                                type: 'lcov',
                                options: {
                                    dir: 'coverage'
                                }
                            },
                            {
                                type: 'html',
                                options: {
                                    dir: 'coverage'
                                }
                            },
                            {
                                type: 'text-summary'
                            }
                        ],
                        template: 'src/tests/test.tpl.html',
                        templateOptions: {
                            deps: ['dist/giotto.js']
                        }
                    },
                }
            }
        },
        coveralls: {
            options: {
                src: 'coverage/lcov.info',
                force: false
            },
            target: {
                src: 'coverage/lcov.info',
                force: false
            }
        }
    });
    //
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-string-to-js');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-coveralls');
    //
    grunt.registerTask('gruntfile', 'jshint Gruntfile.js',
            ['jshint:gruntfile']);
    grunt.registerTask('build', 'Compile and lint all libraries',
            ['gruntfile', 'str2js', 'concat', 'jshint', 'uglify']);
    grunt.registerTask('coverage', 'Test coverage using Jasmine and Istanbul',
            ['jasmine:coverage']);
    grunt.registerTask('all', 'Compile lint and test all libraries',
            ['build', 'jasmine']);
    grunt.registerTask('default', ['build', 'jasmine:test']);


    for_each(libs, function (name) {
        var tasks = [];
        if (concats[name]) tasks.push('concat:' + name);
        tasks.push('jshint:' + name);
        if (this.minify !== false) tasks.push('uglify:' + name);
        //
        grunt.registerTask(name, tasks.join(', '), tasks);
    });
};
