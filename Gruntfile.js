module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: karmaConfig(),
        jshint: jshintConfig(),
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'karma:ci']);
};

function karmaConfig() {
    var config = {};
    config.options = {};
    config.options.configFile = 'karma.conf.js';
    config.ci = {};
    config.ci.singleRun = true; 
    config.dev = {}; 
    config.dev.reporters = 'dots'; 
    return config;
}

function jshintConfig() {
    var jshint;
    jshint = {};
    jshint.code = ['app2.js', 'Gruntfile.js'];
    jshint.spec = {};
    jshint.spec.files = {};
    jshint.spec.files.src = ['specs/**/*.js'];
    jshint.spec.options = {};
    jshint.spec.options.globals = {};
    jshint.spec.options.globals.describe = true;
    jshint.spec.options.globals.it = true;
    jshint.spec.options.globals.expect = true;
    return jshint;
}
