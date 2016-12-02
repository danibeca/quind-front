module.exports = function (gulp, plugins, args) {
    return function (done) {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var files = [].concat(
            gConstants.temp + '**/*.js',
            gConstants.build + 'js/**/*.js'
        );
        gFun.log('Cleaning JavaScript Files', plugins);
        gFun.clean(files, plugins, done);
    };
};