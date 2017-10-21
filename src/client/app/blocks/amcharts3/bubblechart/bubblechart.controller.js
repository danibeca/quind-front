/**
 * @author jmruiz6
 * created on 10.20.2017
 */
/* jshint -W101, -W117 */
(function () {
    'use strict';

    angular.module('blocks.amcharts3')
        .controller('BubbleChartCtrl', BubbleChartCtrl);

    /* @ngInject */
    function BubbleChartCtrl(bubbleChartService) {
        var vm = this;

        vm.spinner = 'amSpinner' + Math.random() * 1000;
        vm.createChart = createChart;
        vm.isJsonString = isJsonString;

        function createChart() {
            vm.chart = bubbleChartService.createChart(vm.chartid, bubbleChartService.transformData(vm.data, vm.config));
        }

        function isJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
    }

})();
