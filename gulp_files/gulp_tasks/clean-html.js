module.exports = function (gulp, plugins, args) {
    return function (done) {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();

        gFun.log('Cleaning HTML Files', plugins);
        gFun.clean(gConstants.build + '**/*.html', plugins, done);
    };
};