module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai-jquery', 'jquery-1.11.0', 'chai-changes', 'sinon-chai', 'chai', 'fixture'],
    files: [
      'public/javascripts/vendor/xhr.min.js',
      'public/javascripts/vendor/time.min.js',
      'public/javascripts/vendor/timeFormat.min.js',
      'public/javascripts/vendor/handlebars-v3.0.3.js',
      'public/javascripts/vendor/raphael-min.js',
      'public/javascripts/vendor/morris.min.js',
      'public/javascripts/helpers/helper.js',
      'public/javascripts/helpers/templateHelper.js',
      'public/javascripts/helpers/dataHelper.js',
      'public/javascripts/helpers/raphaelHelper.js',
      'public/javascripts/landing-pages.js',
      'public/javascripts/search.js',
      'public/javascripts/traffic.js',
      'public/javascripts/content.js',
      'tests/**/*Spec.js',
      'tests/fixtures/**/*'
    ],
    exclude: [
      '**/*.swp'
    ],
    preprocessors: {
      'public/javascripts/*.js': ['coverage'],
      'public/javascripts/helpers/*.js': ['coverage'],
      'tests/**/*.json'   : ['json_fixtures']
    },
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },
    reporters: ['progress', 'coverage', 'coveralls'],
    coverageReporter: {
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'lcov-report' },
      ],
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
