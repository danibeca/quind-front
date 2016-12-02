module.exports = function (gulp, plugins, args) {
    return function () {
        var gServe = require('../../gulp_files/gulp.user.serve');
        var gFun = require('../../gulp_files/gulp.user.functions');

        gFun.log('Running serve-dev',plugins);
        gServe.serve(true /* isDev */, false /* specRunner */,  gulp, plugins, args);

    };
};