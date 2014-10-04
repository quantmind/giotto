/*jshint node: true */
/*global config:true, task:true, process:true*/
module.exports = function (grunt) {
  "use strict";
    // Project configuration.
    var docco_output = '../docs/lux/html/docco',
        //docco_output = 'docs/build/html/docco',
        // All libraries
        libs = grunt.file.readJSON('files.json');
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
    });
    //
    function uglify_libs () {
        var result = {};
        for_each(libs, function (name) {
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
                        prettyPrint: true,
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
            result[name] = this.dest;
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
        concat: libs,
        uglify: uglify_libs(),
        jshint: jshint_libs(),
        jasmine: {
            src : 'dist/d3ext.min.js',
            options : {
                specs : 'src/tests/*.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfig: {
                        paths: {
                            d3: "node_modules/d3/d3.min"
                        }
                    }
                }
            }
        }
    });
    //
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    //
    grunt.registerTask('gruntfile', 'jshint Gruntfile.js',
            ['jshint:gruntfile']);
    grunt.registerTask('build', 'Compile and lint all libraries',
            ['gruntfile', 'concat', 'jshint', 'uglify']);
    grunt.registerTask('all', 'Compile lint and test all libraries',
            ['build', 'jasmine']);
    grunt.registerTask('default', ['all']);
    //
    for_each(libs, function (name) {
        var tasks = ['concat:' + name, 'jshint:' + name];
        if (this.minify !== false)
            tasks.push('uglify:' + name);
        //
        grunt.registerTask(name,
            'Compile & lint "' + name + '" library into ' + this.dest, tasks);
    });
};
