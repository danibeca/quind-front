/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('blocks.charts')
        .directive('dashboardPieChart', dashboardPieChart);

    /* @ngInject */
    function dashboardPieChart() {
        return {
            restrict: 'E',
            controller: 'DashboardPieChartCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/charts/piechart/piechart.template.html',
            scope: {
                percent: '@',
                chartid: '@'
            },
            link: function (scope, element, attrs, controller) {
                scope.$watch('percent', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        controller.percent = scope.percent;
                        if (controller.pie === undefined) {
                            controller.createPieChart(scope.chartid);
                        }
                        controller.updatePieChart(scope.percent);
                    }
                });
            }
        };
    }
})();
