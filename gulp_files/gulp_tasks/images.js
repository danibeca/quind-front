module.exports = function (gulp, plugins, args) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var config = {
            images: gConstants.client + 'images/**/*.*',
            build: gConstants.build
        };

        gFun.log('Compressing and copying images', plugins);

        return gulp
            .src(config.images)
            .pipe(plugins.imagemin({optimizationLevel: 4}))
            .pipe(gulp.dest(config.build + 'images'));


    };
};