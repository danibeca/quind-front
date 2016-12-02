module.exports = function (gulp, plugins, args) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var config = {
            fonts: gConstants.bower.directory + 'font-awesome/fonts/**/*.*',
            build: gConstants.build
        };

        gFun.log('Copying fonts', plugins);

        return gulp
            .src(config.fonts)
            .pipe(gulp.dest(config.build + 'fonts'));
    };
};