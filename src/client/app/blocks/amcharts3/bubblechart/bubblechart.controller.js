/**
 * @author danibeca
 * created on 02.22.2017
 */
/* jshint -W101, -W117 */
(function () {
    'use strict';

    angular.module('blocks.amcharts3')
        .controller('BubbleChartCtrl', BubbleChartCtrl);

    /* @ngInject */
    function BubbleChartCtrl(bubbleChartService) {
        var vm = this;

        vm.createChart = createChart;
        vm.isJsonString = isJsonString;

        function createChart(id, data, graphs) {
            var pros = bubbleChartService.transformData(vm.data);
            vm.chart = bubbleChartService.createChart(vm.chartid, pros.data, pros.graphs, vm.bottomAxe, vm.leftAxe);
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
