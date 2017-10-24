/**
 * @author jmruiz6
 * created on 10.20.2017
 */
(function () {
    'use strict';

    angular.module('blocks.amcharts3')
        .directive('bubbleChart', bubbleChart);

    /* @ngInject */
    function bubbleChart($timeout, spinnerService) {

        return {
            restrict: 'E',
            controller: 'BubbleChartCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/amcharts3/bubblechart/bubblechart.template.html',
            scope: {
                chartid: '@',
                data: '@',
                config: '@',
                loading: '@',
                error: '@'
            },
            link: function (scope, element, attrs, controller) {
                scope.$watch('chartid', function () {
                    if (scope.chartid !== undefined && scope.chartid !== '') {
                        controller.chartid = scope.chartid;
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

                scope.$watch('config', function () {
                    if (scope.config !== undefined && scope.config !== '') {
                        controller.config = JSON.parse(scope.config);
                        if (isReady()) {
                            createChart();
                        }
                    }
                });

                scope.$watch('loading', function () {
                    if (scope.loading !== undefined && scope.loading !== '') {
                        controller.loading = scope.loading;
                    }
                });

                scope.$watch('error', function () {
                    if (scope.error !== undefined && scope.error !== '') {
                        spinnerService.hide(controller.spinner);
                    }
                });

                function isReady() {
                    var result = false;
                    if (controller.chartid !== undefined && controller.chartid !== '' &&
                        controller.data !== undefined && controller.data !== '' &&
                        controller.config !== undefined && controller.config !== ''
                    ) {
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
