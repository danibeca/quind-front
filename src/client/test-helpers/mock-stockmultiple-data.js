/* jshint -W079, -W109, -W117*/
/*jshint unused:false, maxlen:false*/
/* jscs:disable */

var stockMultipleDirDataMock = (function () {
    return {
        getVars: getVars,
        getLabels: getLabels,
        getAll: getAll
    };

    function getVars() {
        return {
            0: 'value2',
            1: 'data2'
        };

    }

    function getLabels(title) {
        return {
            'title': title
        };
    }

    function getAll(series) {
        var result = [];
        var ids = [];
        var labels = [];
        var vars;
        var dSeries = [];

        vars = stockMultipleDirDataMock.getVars();

        ids.push(1);
        labels[1] = stockMultipleDirDataMock.getLabels('Code Health');
        dSeries[1] = series;

        ids.push(2);
        labels[2] = stockMultipleDirDataMock.getLabels('Reliability');
        dSeries[2] = series;

        result.ids = ids;
        result.labels = labels;
        result.series = dSeries;

        result.vars = vars;

        return result;

    }
})();