module.exports = function(karma) {
    var config = {};
    config.basePath = '';
    config.frameworks = ['jasmine'];
    config.files = [
        'angular.js',
        'angular-mocks.js',
        'app2.js',
        'specs/**/*.js',
    ];
    config.reporters = ['dots'];
    config.port = 9876;
    config.runnerPort = 9100;
    config.colors = true;
    config.logLevel = karma.LOG_INFO;
    config.autoWatch = true;
    config.browsers = ['Chrome'];
    config.captureTimeout = 60000;
    config.singleRun = false;

    karma.set(config);
};


