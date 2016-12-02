module.exports = function (gulp, plugins, args) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var wiredep = require('wiredep').stream;
        var options = {
            bowerJson: gConstants.bower.json,
            directory: gConstants.bower.directory,
            ignorePath: gConstants.bower.ignorePath
        };
        var config = {
            js: gConstants.js,
            stubsjs: [
                gConstants.bower.directory + 'angular-mocks/angular-mocks.js',
                gConstants.client + 'stubs/**/*.js'
            ],
            client: gConstants.client,
            jsOrder: gConstants.jsOrder,
            index: gConstants.index
        };
        // Only include stubs if flag is enabled
        var js = args.stubs ? [].concat(config.js, config.stubsjs) : config.js;

        gFun.log('Wiring the bower dependencies into the html', plugins);

        return gulp
            .src(config.index)
            .pipe(wiredep(options))
            .pipe(plugins.inject(gulp.src(js), '', config.jsOrder))
            .pipe(gulp.dest(config.client));
    };
};