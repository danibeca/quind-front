module.exports = function (gulp, plugins, args) {
    return function () {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var config = {
            less: gConstants.less,
            sass: gConstants.sass,
            temp: gConstants.temp,
            sassDashboard: gConstants.sassDashboard,
            client: gConstants.client
        };
        var browserSync = require('browser-sync');
        var merge = require('merge-stream');
        var wiredep = require('wiredep').stream;
        var _ = require('lodash');
        gFun.log('Compiling Less and SASS--> CSS', plugins);
        var sassOptions = {
            style: 'expanded'
        };

        var injectFiles = gulp.src(config.sassDashboard, {read: false});

        var injectOptions = {
            transform: function (filePath) {
                filePath = filePath.replace('src/client/styles/dashboard/', '');
                return '@import "' + filePath + '";';
            },
            starttag: '// injector',
            endtag: '// endinjector',
            addRootSlash: false
        };


        gulp.src(config.less)
            .pipe(plugins.plumber()) // exit gracefully if something fails after this
            .pipe(plugins.less())
            .pipe(plugins.autoprefixer({browsers: ['last 2 version', '> 5%']}))
            .pipe(gulp.dest(config.temp))
            .pipe(browserSync.stream({match: '**/*.css'}));
        ;

        return gulp.src(config.sass)
            .pipe(plugins.inject(injectFiles, injectOptions))
            .pipe(wiredep(_.extend({}, {
                exclude: [/\/bootstrap\.js$/, /\/bootstrap-sass\/.*\.js/, /\/require\.js/],
                directory: 'bower_components'
            })))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass(sassOptions))
            .pipe(plugins.autoprefixer())
            .pipe(plugins.sourcemaps.write())
            .pipe(gulp.dest(config.temp));
    };
};