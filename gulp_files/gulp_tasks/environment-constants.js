module.exports = function (gulp, plugins, env) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var configPath = 'constants.json';
        var enviroment = 'production';

        gFun.log('Setting environment constants', plugins);

        if (env == 'dev') {
            enviroment = 'local';
        }

        return gulp.src(configPath)
            .pipe(plugins.ngConfig('blocks.constants', {environment: enviroment}))
            .pipe(plugins.injectString.before('angular', '/* jshint ignore:start */\n'))
            .pipe(plugins.injectString.before('angular', '// jscs:disable\n'))
            .pipe(plugins.rename('constants.module.js'))
            .pipe(gulp.dest('src/client/app/blocks/constants'));
    };
};