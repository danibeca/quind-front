/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('blocks.amcharts3')
        .directive('dashboardPieChart', dashboardPieChart);

    /* @ngInject */
    function dashboardPieChart(spinnerService) {
        return {
            restrict: 'E',
            controller: 'DashboardPieChartCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/amcharts3/piechart/piechart.template.html',
            scope: {
                percent: '@',
                chartid: '@'
            },
            link: function (scope, element, attrs, controller) {
                scope.$watch('percent', function (newValue, oldValue) {
                    if (newValue !== oldValue || controller.pie === undefined) {
                        controller.percent = scope.percent;
                        if (controller.pie === undefined && newValue !== '') {
                            spinnerService.hide('html5spinner' + controller.id);
                            var delay = 0;
                            if (controller.percent !== undefined) {
                                delay = 50;
                            }
                            setTimeout(function () {
                                controller.createPieChart(scope.chartid);

                            }, delay);
                        }
                    } else if (controller.pie !== undefined) {
                        controller.updatePieChart(scope.percent);
                    }


                });
            }
        };
    }
})();
