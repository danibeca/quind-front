/**
 * @author jmruiz6
 * created on 10.20.2017
 */
/* jshint -W101, -W117 */
(function () {
    'use strict';

    angular.module('blocks.amcharts3')
        .controller('CylinderChartCtrl', CylinderChartCtrl);

    /* @ngInject */
    function CylinderChartCtrl(cylinderChartService) {
        var vm = this;

        vm.spinner = 'amSpinner' + Math.random() * 1000;
        vm.chartId = 'id';
        vm.createChart = createChart;

        function createChart() {
            try {
                vm.chart = cylinderChartService.createChart(vm.chartId, cylinderChartService.transformData(vm.data));
            } catch (error) {
                console.log(error);
            }

        }
    }
})();
