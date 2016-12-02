module.exports = function (gulp, plugins, args) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var config = {
            htmltemplates: gConstants.clientApp + '**/*.html',
            templateCache: {
                file: 'templates.js',
                options: {
                    module: 'app.core',
                    root: 'app/',
                    standalone: false
                }
            },
            temp: gConstants.temp
        };

        gFun.log('Creating an AngularJS $templateCache', plugins);

        return gulp
            .src(config.htmltemplates)
            .pipe(plugins.if(args.verbose, plugins.bytediff.start()))
            .pipe(plugins.minifyHtml({empty: true}))
            .pipe(plugins.if(args.verbose, plugins.bytediff.stop(gFun.bytediffFormatter)))
            .pipe(plugins.angularTemplatecache(
                config.templateCache.file,
                config.templateCache.options
            ))
            .pipe(gulp.dest(config.temp));
    };
};