module.exports = {
    serve: serve
};

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner, gulp, plugins, args) {
    var gConstants = require('./gulp.user.config').constants();
    var gFun = require('./gulp.user.functions');

    var defaultPort = '8001';
    var port = process.env.PORT || defaultPort;

    var config = {
        server: gConstants.server,
        port: port,
        nodeServer: gConstants.nodeServer,
        browserReloadDelay: 1000,
        less: gConstants.less,
        styleWatch: gConstants.styleWatch,
        js: gConstants.js,
        html: gConstants.html,
        client: gConstants.client,
        temp: gConstants.temp,
        specRunnerFile: gConstants.specRunnerFile


    };

    var debugMode = '--debug';
    var nodeOptions = getNodeOptions(isDev, config);
    var browserSync = require('browser-sync');
    nodeOptions.nodeArgs = [debugMode + '=5858'];

    if (args.verbose) {
        console.log(nodeOptions);
    }

    return plugins.nodemon(nodeOptions)
        .on('restart', ['vet'], function (ev) {
            gFun.log('*** nodemon restarted', plugins);
            gFun.log('files changed:\n' + ev, plugins);
            setTimeout(function () {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            gFun.log('*** nodemon started', plugins);

            startBrowserSync(isDev, specRunner, config, browserSync, port, gulp, args, plugins);
        })
        .on('crash', function () {
            gFun.log('*** nodemon crashed: script crashed for some reason', plugins);
        })
        .on('exit', function () {
            gFun.log('*** nodemon exited cleanly', plugins);
        });
}

function getNodeOptions(isDev, config) {

    return {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': config.port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };
}

//function runNodeInspector() {
//    log('Running node-inspector.');
//    log('Browse to http://localhost:8080/debug?port=5858');
//    var exec = require('child_process').exec;
//    exec('node-inspector');
//}

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(isDev, specRunner, config, browserSync, port, gulp, args, plugins) {
    var gFun = require('./gulp.user.functions');


    if (args.nosync || browserSync.active) {
        return;
    }


    gFun.log('Starting BrowserSync on port ' + port, plugins);

    // If build: watches the files, builds, and restarts browser-sync.
    // If dev: watches less, compiles it to css, browser-sync handles reload
    if (isDev) {
        gulp.watch([config.styleWatch], ['styles'], ['browserSyncReload'])
            .on('change', changeEvent);
    } else {
        gulp.watch([config.less, config.js, config.html], ['browserSyncReload'])
            .on('change', changeEvent);
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: isDev ? [
            config.client + '**/*.*',
            '!' + config.less,
            config.temp + '**/*.css'
        ] : [],
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'info',
        logPrefix: 'agilin',
        notify: true,
        reloadDelay: 0 //1000
    };
    if (specRunner) {
        options.startPath = config.specRunnerFile;
    }

    browserSync(options);


    /**
     * When files change, log it
     * @param  {Object} event - event that fired
     */
    function changeEvent(event) {
        var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
        gFun.log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type, plugins);
    }


}






