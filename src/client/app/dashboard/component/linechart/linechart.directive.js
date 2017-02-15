/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.dashboard')
        .directive('dashboardLineChart', dashboardLineChart);

    /* @ngInject */
    function dashboardLineChart() {
        return {
            restrict: 'E',
            controller: 'DashboardLineChartCtrl',
            controllerAs: 'lineCtrl',
            templateUrl: 'app/dashboard/component/linechart/linechart.template.html',
            scope: {
                linedata: '@'
            },
            link: function (scope, element, attrs, controller) {
                scope.$watch('linedata', function (newValue, oldValue) {
                    if (newValue !== oldValue || controller.isFirstRun()) {
                        controller.updateLineChart();
                    }
                });
            }
        };
    }
})();
