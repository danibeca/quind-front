module.exports = function (gulp, plugins, args) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var alljs = [
            './src/**/*.js',
            './*.js'
        ];

        gFun.log('Analyzing source with JSHint and JSCS', plugins);

        gulp
            .src(alljs)
            .pipe(plugins.if(args.verbose, plugins.print()))
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter('jshint-stylish', {verbose: true}))
            .pipe(plugins.jshint.reporter('fail'));

        return gulp
            .src(alljs)
            .pipe(plugins.jscs())
            .pipe(plugins.jscs.reporter())
            .pipe(plugins.jscs.reporter('fail'));

    };
};