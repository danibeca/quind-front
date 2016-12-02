module.exports = function (gulp, plugins, args) {
    return function () {
        var gServe = require('../../gulp_files/gulp.user.serve');
        var gFun = require('../../gulp_files/gulp.user.functions');

        gFun.log('Run serve-build',plugins);
        gServe.serve(false /* isDev */, false /* specRunner */,  gulp, plugins, args);

    };
};