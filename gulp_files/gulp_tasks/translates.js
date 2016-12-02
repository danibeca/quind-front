module.exports = function (gulp, plugins) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var config = {
            translate: gConstants.client + '/app/i18n/**/*.*',
            build: gConstants.build
        };

        gFun.log('Copying translations', plugins);

        return gulp
            .src(config.translate)
            .pipe(gulp.dest(config.build + '/app/i18n'));


    };
};