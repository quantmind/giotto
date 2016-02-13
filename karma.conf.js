module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS', 'Firefox', 'ChromeNoSandbox'],

        phantomjsLauncher: {
            exitOnResourceError: true
        },
        basePath: '',
        frameworks: ['browserify', 'jasmine'],

        files: [
            'test/**/*.js'
        ],

        preprocessors: {
            'src/**/*.js': ['browserify'],
            'test/**/*.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: [['babelify', {presets: ['es2015']}]]
        },

        customLaunchers: {
            ChromeNoSandbox: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        }
    });
};
