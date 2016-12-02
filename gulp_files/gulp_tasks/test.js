module.exports = function (gulp, plugins, args) {
    return function (done) {
        var gFun = require('../../gulp_files/gulp.user.functions');
        var gConstants = require('../../gulp_files/gulp.user.config').constants();
        var config = {
            serverIntegrationSpecs: gConstants.serverIntegrationSpecs,
            nodeServer: gConstants.nodeServer,
            client: gConstants.client
        };

        gFun.log('Starting Tests', plugins);

        startTests(true /*singleRun*/, config, plugins, done);
    };

    /**
     * Start the tests using karma.
     * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
     * @param  {Object} config - Array of constants needed for this process
     * @param  {Object} plugins - Listing gulp plugins
     * @param  {Function} done - Callback to fire when karma is done
     * @return {undefined}
     */
    function startTests(singleRun, config, plugins, done) {
        var child;
        var excludeFiles = [];
        var fork = require('child_process').fork;
        var karma = require('karma').server;
        var serverSpecs = config.serverIntegrationSpecs;

        if (args.startServers) {
            gFun.log('Starting servers',plugins);
            var savedEnv = process.env;
            savedEnv.NODE_ENV = 'dev';
            savedEnv.PORT = 8888;
            child = fork(config.nodeServer);
        } else {
            if (serverSpecs && serverSpecs.length) {
                excludeFiles = serverSpecs;
            }
        }

        karma.start({
            configFile: __dirname + '/../../karma.conf.js',
            exclude: excludeFiles,
            singleRun: !!singleRun
        }, karmaCompleted);

        ////////////////

        function karmaCompleted(karmaResult) {
            var gFun = require('../../gulp_files/gulp.user.functions');
            var plugins = require('gulp-load-plugins')({lazy: true});
            gFun.log('Karma completed',plugins);
            if (child) {
                gFun.log('shutting down the child process',plugins);
                child.kill();
            }
            if (karmaResult === 1) {
                done('karma: tests failed with code ' + karmaResult);
            } else {
                done();
            }
        }
    }
};