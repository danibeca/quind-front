module.exports = function (gulp, plugins, args) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var config = {
            plato: {js: gConstants.clientApp + '**/*.js'},
            report: gConstants.report
        };

        gFun.log('Analyzing source with Plato', plugins);
        gFun.log('Browse to /report/plato/index.html to see Plato results', plugins);

        startPlatoVisualizer(args, config, plugins);
    };

    /**
     * Start Plato inspector and visualizer
     */

    function startPlatoVisualizer(args, config, plugins, done) {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var glob = require('glob');
        var plato = require('plato');
        var files = glob.sync(config.plato.js);
        var excludeFiles = /.*\.spec\.js/;
        var options = {
            title: 'Plato Inspections Report',
            exclude: excludeFiles
        };
        var outputDir = config.report + '/plato';

        gFun.log('Running Plato', plugins);
        plato.inspect(files, outputDir, options, platoCompleted);

        function platoCompleted(report, done) {
            var overview = plato.getOverviewReport(report);
            if (args.verbose) {
                gFun.log(overview.summary, plugins);
            }
            if (done) {
                done();
            }
        }
    }
};