/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
/* jshint -W117 */
(function () {
    'use strict';

    angular.module('app.dashboard')
        .controller('DashboardPieChartCtrl', DashboardPieChartCtrl);

    /* @ngInject */
    function DashboardPieChartCtrl($scope, $timeout, baConfig, baUtil) {

        var vm = this;
        vm.updatePieCharts = updatePieCharts;

        var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
        $scope.charts = [{
            color: pieColor,
            description: 'Estado del codigo',
            stats: '820',
            icon: 'person',
            percent: $scope.percent,
        }
        ];

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        function loadPieCharts() {
            $('.chart').each(function () {
                var chart = $(this);
                chart.easyPieChart({
                    easing: 'easeOutBounce',
                    onStep: function (from, to, percent) {
                        $(this.el).find('.percent').text(Math.round(percent));
                    },
                    barColor: function (percent) {
                        /*percent /= 100;
                         return "rgb(" + Math.round(255 * (1-percent)) + ", " + Math.round(255 * percent) + ", 0)";*/
                        var color = '#ed2e08'; //red
                        if (percent >= 80) {
                            color = '#5ebe01'; //green
                        } else if (percent <= 79 && percent >= 51) {
                            color = '#FFFF4D';//yellow
                        }
                        else if (percent <= 50 && percent >= 39) {
                            color = '#fe7903';//orange
                        }
                        return color
                    },

                    size: 164,
                    animation: 3000,
                    lineWidth: 9,
                    lineCap: 'square',
                });
            });

            $('.refresh-data').on('click', function () {
                updatePieCharts();
            });
        }

        function updatePieCharts() {
            var delay = 0;
            if ($('.pie-charts .chart').first().data('easyPieChart') === undefined) {
                delay = 1000;
            }
            $timeout(function () {
                $('.pie-charts .chart').each(function (index, chart) {
                    $(chart).data('easyPieChart').update($scope.percent);

                });
            }, delay);
        }

        $timeout(function () {
            loadPieCharts();
            //updatePieCharts();
        }, 1000);
    }
})();
