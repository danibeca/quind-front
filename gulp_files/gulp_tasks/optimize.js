module.exports = function (gulp, plugins) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();


        var config = {
            index: gConstants.index,
            templateCache: gConstants.temp + gConstants.templateCache.file,
            build: gConstants.build
        };

        var jsAppFilter = plugins.filter('**/' + 'app.js', {restore: true});
        var jslibFilter = plugins.filter('**/' + 'lib.js', {restore: true});
        var cssFilter = plugins.filter('**/*.css', {restore: true});
        var indexHtmlFilter = plugins.filter(['**/*', '!**/index.html'], { restore: true });

        gFun.log('Optimizing the js, css, and html', plugins);

        var injectPlugin = require('gulp-inject');

        gFun.log(config.templateCache, plugins);
        return gulp
            .src(config.index)
            .pipe(injectPlugin(gulp.src(config.templateCache, {read: false}), {name: 'templates'}))
            .pipe(plugins.useref({searchPath: ['./']}))
            .pipe(cssFilter)
            .pipe(plugins.replace('./themes/default/assets/fonts', '../fonts'))
            .pipe(plugins.minifyCss({ keepSpecialComments: 1, processImport: false }))


            .pipe(cssFilter.restore)
            .pipe(jsAppFilter)
            .pipe(plugins.ngAnnotate({add: true}))
            .pipe(plugins.uglify({ mangle: false }))
            .pipe(getHeader())
            .pipe(jsAppFilter.restore)
            .pipe(jslibFilter)
            .pipe(plugins.uglify())
            .pipe(jslibFilter.restore)
            .pipe(indexHtmlFilter)
            .pipe(plugins.rev())                // Rename the concatenated files (but not index.html)
            .pipe(indexHtmlFilter.restore)
            .pipe(plugins.revReplace())
            .pipe(gulp.dest(config.build));
    };


    /**
     * Format and return the header for files
     * @return {String}           Formatted file header
     */
    function getHeader() {
        var pkg = require('../../package.json');
        var headerPlugin = require('gulp-header');
        var template = ['/**',
            ' * <%= pkg.name %> - <%= pkg.description %>',
            ' * @authors <%= pkg.authors %>',
            ' * @version v<%= pkg.version %>',
            ' * @link <%= pkg.homepage %>',
            ' * @license <%= pkg.license %>',
            ' */',
            ''
        ].join('\n');
        return headerPlugin(template, {
            pkg: pkg
        });
    }

    /**
     * Inject files in a sorted sequence at a specified inject label
     * @param   {Array} src   glob pattern for source files
     * @param   {String} label   The label name
     * @param   {Array} order   glob pattern for sort order of the files
     * @returns {Stream}   The stream
     */
    function inject(src, label, order) {
        var options = {read: false};
        var injectPlugin = require('gulp-inject');
        if (label) {
            options.name = 'inject:' + label;
        }

        return injectPlugin(gulp.src(src), options);
    }

    /**
     * Order a stream
     * @param   {Stream} src   The gulp.src stream
     * @param   {Array} order Glob array pattern
     * @returns {Stream} The ordered stream
     */
    function orderSrc(src, order) {
        //order = order || ['**/*'];
        var orderPlugin = require('gulp-order');
        var ifPlugin = require('gulp-if');
        return gulp
            .src(src)
            .pipe(ifPlugin(order, orderPlugin(order)));
    }

};