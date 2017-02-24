/**
 * @author danibeca
 * created on 02.22.2017
 */
(function () {
    'use strict';

    angular.module('blocks.charts')
        .directive('dashboardLineChart', dashboardLineChart);

    /* @ngInject */
    function dashboardLineChart() {
        return {
            restrict: 'E',
            controller: 'DashboardLineChartCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/charts/linechart/linechart.template.html',
            scope: {
                linedata: '@',
                lineid: '@'
            },
            link: function (scope, element, attrs, controller) {
                scope.$watch('linedata', function () {
                    if (controller.isJsonString(scope.linedata)) {
                        var dataProvider = JSON.parse(scope.linedata);
                        if (controller.chart === undefined) {
                            controller.createLineChart(scope.lineid, dataProvider);
                        } else {
                            controller.updateLineChart(dataProvider);
                        }
                    }
                });
            }
        };
    }
})();
