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
                    if (newValue !== oldValue || controller.pie === undefined) {
                        var ready = false;
                        controller.percent = scope.percent;
                        if (controller.pie === undefined && newValue !== '') {
                            var delay = 0;
                            if(controller.percent !== undefined){
                                delay = 100;
                            }
                            setTimeout(function(){
                                controller.createPieChart(scope.chartid);
                                var ready = true;

                            }, delay);
                        }
                        if(ready){
                            controller.updatePieChart(scope.percent);
                        }
                    }
                });
            }
        };
    }
})();
