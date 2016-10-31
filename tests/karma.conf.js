const webpackConfig = require('../webpack.config.js');

// karma configuration
const karmaConf = {
  basePath: '../',
  webpack: webpackConfig,
  webpackMiddleware: {
    stats: {
      colors: true,
    },
  },
  browsers: ['Firefox', 'Chrome'],
  client: {
    captureConsole: true,
    mocha: { ui: 'tdd' },
  },
  envPreprocessor: [
    'TEST_ENV',
  ],
  files: [
    // Define test files.
    { pattern: 'tests/**/*.test.js' },
    // Serve test assets.
    { pattern: 'tests/assets/**/*', included: false, served: true },
  ],
  frameworks: ['mocha', 'sinon-chai', 'chai-shallow-deep-equal'],
  preprocessors: {
    'tests/**/*.js': ['webpack', 'env'],
  },
  reporters: ['mocha'],
};

// configuration for code coverage reporting
if (process.env.TEST_ENV === 'ci') {
  karmaConf.coverageReporter = {
    dir: 'tests/coverage',
    includeAllSources: true,
    reporters: [
      { type: 'html', subdir: 'report' },
      { type: 'lcov', subdir: '.' },
    ],
  };
  karmaConf.reporters.push('coverage');
  karmaConf.preprocessors['src/**/*.js'] = ['coverage'];
}

// Apply configuration
module.exports = function (config) {
  config.set(karmaConf);
};
