module.exports = function (gulp, plugins) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var del = require('del');
        var msg = {
            title: 'gulp build',
            subtitle: 'Deployed to the build folder',
            message: 'Running `gulp serve-build`'
        };

        gFun.log('Building everything', plugins);

        del(gConstants.temp);
        gFun.log(msg, plugins);
        gFun.notify(msg);
    };
};