/**
 * @author Daniel Betancur <danibeca@okazo.co>
 * created on 03.29.2017
 */
/* jshint -W117, -W030 */
(function () {
    'use strict';

    angular.module('blocks.amcharts3')
        .controller('StockMultipleChartCtrl', StockMultipleChartCtrl);

    /* @ngInject */
    function StockMultipleChartCtrl(stockMultipleService) {
        var vm = this;
        vm.id = 'smc' + Math.round(Math.random() * 10000);
        vm.spinner = 'amSpinner' + Math.random() * 1000;

        vm.createChart = createChart;

        function createChart() {

            vm.chart = stockMultipleService.createChart(vm.id,
                stockMultipleService.transformData(vm.ids, vm.vars, vm.labels, vm.series, vm.lang)
            )
            ;

        }
    }

})();
