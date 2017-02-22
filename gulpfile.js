var gulp = require('gulp');
var args = require('yargs').argv;
var plugins = require('gulp-load-plugins')({lazy: true});
var gConstants = require('./gulp_files/gulp.user.config').constants();
var browserSync = require('browser-sync');
require('events').EventEmitter.defaultMaxListeners = Infinity;
//var gFun = require('./gulp_files/gulp.user.functions');
//var gServe = require('./gulp_files/gulp.user.serve');

/**
 * List the available gulp tasks
 */
gulp.task('help', plugins.taskListing);
gulp.task('default', ['help']);

gulp.task('vet', getTask('vet')(gulp, plugins, args));
gulp.task('plato', getTask('plato')(gulp, plugins, args));

gulp.task('clean-styles', getTask('clean-styles')(gulp, plugins, args));
gulp.task('clean-fonts', getTask('clean-fonts')(gulp, plugins, args));
gulp.task('clean-images', getTask('clean-images')(gulp, plugins, args));
gulp.task('clean-html', getTask('clean-html')(gulp, plugins, args));
gulp.task('clean-js', getTask('clean-js')(gulp, plugins, args));

gulp.task('styles', ['clean-styles'], getTask('styles')(gulp, plugins, args));
gulp.task('fonts', ['clean-fonts'], getTask('fonts')(gulp, plugins, args));
gulp.task('images', ['clean-images'], getTask('images')(gulp, plugins, args));
gulp.task('template-cache', ['clean-html', 'clean-js'], getTask('template-cache')(gulp, plugins, args));
gulp.task('translates', getTask('translates')(gulp, plugins, args));
gulp.task('dev-constants', getTask('environment-constants')(gulp, plugins, 'dev'));
gulp.task('pdn-constants', getTask('environment-constants')(gulp, plugins, 'pdn'));

gulp.task('wiredep', getTask('wiredep')(gulp, plugins, args));
gulp.task('inject', ['wiredep', 'styles', 'template-cache'], getTask('inject')(gulp, plugins, args));

gulp.task('build-specs', getTask('build-specs')(gulp, plugins, args));
gulp.task('serve-specs', ['build-specs'], getTask('serve-specs')(gulp, plugins, args));

gulp.task('test', ['vet', 'plato', 'template-cache'], getTask('test')(gulp, plugins, args));
gulp.task('optimize', ['inject', 'test'], getTask('optimize')(gulp, plugins));

gulp.task('build', ['optimize', 'images', 'fonts', 'translates'], getTask('build')(gulp, plugins));

gulp.task('serve-build', ['pdn-constants', 'build'], getTask('serve-build')(gulp, plugins, args));
gulp.task('serve-dev', ['dev-constants', 'inject'], getTask('serve-dev')(gulp, plugins, args));
gulp.task('browserSyncReload', ['optimize'], browserSync.reload);

gulp.task('less-watcher', function () {
    gulp.watch([gConstants.lessWatch], ['styles']);
});

gulp.task('sonar', getTask('sonar')(gulp, plugins, args));


function getTask(task) {
    return require('./gulp_files/gulp_tasks/' + task);
}

module.exports = gulp;
