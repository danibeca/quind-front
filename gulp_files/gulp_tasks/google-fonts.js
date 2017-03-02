module.exports = function (gulp, plugins, args) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var ggf = require('gulp-google-fonts');
        var browserSync = require('browser-sync');

        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var config = {
            temp: gConstants.temp,
            build: gConstants.build
        };

        gFun.log('Downloading Google fonts', plugins);

        return gulp.src('config.neon')
            .pipe(ggf())
            .pipe(gulp.dest(config.temp))
            .pipe(browserSync.stream({match: '**/*.css'}));


    };
};