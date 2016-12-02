module.exports = function (gulp, plugins, args) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var wiredep = require('wiredep').stream;
        var config = {
            client: gConstants.client,
            temp: gConstants.temp,
            templateCache: gConstants.templateCache,
            specs: [gConstants.clientApp + '**/*.spec.js'],
            serverIntegrationSpecs: gConstants.serverIntegrationSpecs,
            specRunner: gConstants.client + gConstants.specRunnerFile,
            specHelpers: gConstants.specHelpers,
            js: gConstants.js,
            jsOrder: gConstants.jsOrder,
            testlibraries: gConstants.testlibraries
        };

        var options = {
            bowerJson: gConstants.bower.json,
            directory: gConstants.bower.directory,
            ignorePath: gConstants.bower.ignorePath
        };

        gFun.log('building the spec runner', plugins);


        var templateCache = config.temp + config.templateCache.file;

        var specs = config.specs;

        if (args.startServers) {
            specs = [].concat(specs, config.serverIntegrationSpecs);
        }
        options.devDependencies = true;

        return gulp
            .src(config.specRunner)
            .pipe(wiredep(options))
            .pipe(plugins.inject(gulp.src(config.js), '', config.jsOrder))
            .pipe(plugins.inject(gulp.src(config.testlibraries), {name: 'testlibraries'}))
            .pipe(plugins.inject(gulp.src(config.specHelpers), {name: 'spechelpers'}))
            .pipe(plugins.inject(gulp.src(specs), {name: 'specs'}, ['**/*']))
            .pipe(plugins.inject(gulp.src(templateCache), {name: 'templates'}))
            .pipe(gulp.dest(config.client));
    };
};