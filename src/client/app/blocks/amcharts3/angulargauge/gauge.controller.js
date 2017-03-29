/**
 * @author danibeca
 * created on 02.22.2017
 */
(function () {
    'use strict';

    angular.module('blocks.amcharts3')
        .controller('GaugeChartCtrl', GaugeChartCtrl);

    /* @ngInject */
    function GaugeChartCtrl(gaugeService) {
        var vm = this;
        vm.spinner = 'amSpinner' + Math.random() * 1000;

        vm.createChart = createChart;

        function createChart() {
            vm.chart = gaugeService.getGauge(vm.id, gaugeService.transformData(vm.data));
        }
    }
})();


