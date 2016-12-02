module.exports = function (gulp, plugins, args) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var config = {
            index: gConstants.index,
            css: gConstants.css,
            client: gConstants.client
        };

        gFun.log('Wire up css into the html, after files are ready', plugins);

        return gulp
            .src(config.index)
            .pipe(plugins.inject(gulp.src(config.css)))
            .pipe(gulp.dest(config.client));


    };
};