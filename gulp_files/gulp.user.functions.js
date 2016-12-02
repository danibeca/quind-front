module.exports = {
    log: log,
    clean: clean,
    bytediffFormatter: bytediffFormatter,
    notify: notify
};

function log(msg, plugins) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                plugins.util.log(plugins.util.colors.blue(msg[item]));
            }
        }
    } else {
        plugins.util.log(plugins.util.colors.blue(msg));
    }
}

function clean(path, plugins, done) {
    var del = require('del');
    log('Cleaning: ' + plugins.util.colors.blue(path), plugins);
    del(path).then(function() {
      return done();
    });

}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}


/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
    var notifier = require('node-notifier');
    var lodash = require('lodash');
    var path = require('path');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };
    lodash.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}