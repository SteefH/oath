// Karma configuration
// Generated on Tue Jun 09 2015 23:29:11 GMT+0200 (West-Europa (zomertijd))

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks:
      [ 'jasmine'
      , 'jasmine-matchers'
      , 'browserify'
      ],


    // list of files / patterns to load in the browser
    files: [
      // 'node_modules/es6-promise/dist/es6-promise.js',
      // 'src/**/*.js',
      'spec/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      // 'spec/helpers/**/*.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // 'node_modules/**/*.js': ['commonjs'],
      // 'src/*.js': ['commonjs'],
      'spec/**/*.js': ['browserify']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    browserify: {
      transform: ['babelify'],
      debug: true
    }

  });
};
