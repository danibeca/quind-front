/**
 * @author danibeca
 * created on 02.22.2017
 */
/* jshint -W117 */
(function () {
    'use strict';

    angular.module('blocks.charts')
        .controller('DashboardPieChartCtrl', DashboardPieChartCtrl);

    /* @ngInject */
    function DashboardPieChartCtrl($scope, $timeout, baConfig, baUtil) {

        var vm = this;
        vm.color = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
        vm.id = $scope.chartid;
        vm.percent = 0;
        vm.createPieChart = createPieChart;
        vm.updatePieChart = updatePieChart;

        function createPieChart(id) {
            var chart = $('#' + id);
            chart.easyPieChart({
                easing: 'easeOutBounce',
                onStep: function (from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                },
                barColor: function (percent) {
                    var color = '#ed2e08'; //red
                    if (percent >= 80) {
                        color = '#5ebe01'; //green
                    } else if (percent <= 79 && percent >= 51) {
                        color = '#FFFF4D';//yellow
                    }
                    else if (percent <= 50 && percent >= 39) {
                        color = '#fe7903';//orange
                    }
                    return color;
                },

                size: 220,
                animation: 3000,
                lineWidth: 9,
                lineCap: 'square'
            });
            vm.pie = chart;
        }

        function updatePieChart(percent) {
            vm.pie.data('easyPieChart').update(percent);
        }
    }
})();
