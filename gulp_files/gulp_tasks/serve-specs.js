module.exports = function (gulp, plugins, args) {
    return function () {
        var gServe = require('../../gulp_files/gulp.user.serve');
        var gFun = require('../../gulp_files/gulp.user.functions');

        gFun.log('Run the spec runner',plugins);
        gServe.serve(true /* isDev */, true /* specRunner */,  gulp, plugins, args);

    };
};