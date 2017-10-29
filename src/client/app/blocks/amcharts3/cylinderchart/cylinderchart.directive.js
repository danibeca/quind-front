/**
 * @author jmruiz6
 * created on 10.20.2017
 */
(function () {
    'use strict';

    angular.module('blocks.amcharts3')
        .directive('cylinderChart', cylinderChart);

    /* @ngInject */
    function cylinderChart($timeout, spinnerService) {

        return {
            restrict: 'E',
            controller: 'CylinderChartCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/amcharts3/cylinderchart/cylinderchart.template.html',
            scope: {
                chartId: '@',
                data: '@',
                loading: '@',
                error: '@'
            },
            link: function (scope, element, attrs, controller) {
                scope.$watch('chartId', function () {
                    if (scope.chartId !== undefined && scope.chartId !== '') {
                        controller.chartId = scope.chartId;
                        if (isReady()) {
                            createChart();
                        }
                    }
                });

                scope.$watch('data', function () {
                    if (scope.data !== undefined && scope.data !== '') {
                        controller.data = JSON.parse(scope.data);
                        if (isReady()) {
                            createChart();
                        }
                    }
                });

                function isReady() {
                    var result = false;
                    if (controller.chartId !== undefined && controller.chartId !== null &&
                        controller.data !== undefined && controller.data.length > 0) {
                        result = true;
                    }
                    return result;
                }

                function createChart() {
                    var delay = 0;
                    $timeout(function () {
                        controller.createChart();
                        spinnerService.hide(controller.spinner);
                    }, delay);
                }
            }
        };
    }
})();
