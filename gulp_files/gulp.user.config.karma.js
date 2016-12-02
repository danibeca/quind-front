module.exports = {
    karma: karma
};

function karma() {
    var gConstants = require('./gulp.user.config').constants();
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true})['js'];
    var options = {
        files: [].concat(
            bowerFiles,
            gConstants.specHelpers,
            gConstants.clientApp + '**/*.module.js',
            gConstants.clientApp + '**/*.js',
            gConstants.temp + gConstants.templateCache.file,
            gConstants.serverIntegrationSpecs
        ),
        exclude: [],
        coverage: {
            dir: gConstants.report + 'coverage',
            reporters: [
                // reporters not supporting the `file` property
                {type: 'html', subdir: 'report-html'},
                {type: 'lcov', subdir: 'report-lcov'},
                {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
            ]
        },
        preprocessors: {}
    };
    options.preprocessors[gConstants.clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
    return options;
}
