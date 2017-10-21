/**
 * @author jmruiz6
 * created on 10.20.2017
 */
(function () {
    'use strict';

    angular.module('blocks.amcharts3')
        .directive('bubbleChart', bubbleChart);

    /* @ngInject */
    function bubbleChart($timeout) {

        return {
            restrict: 'E',
            controller: 'BubbleChartCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/amcharts3/bubbleChart/bubblechart.template.html',
            scope: {
                chartid: '@',
                data: '@',
                bottomAxe: '@',
                leftAxe: '@',
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

                scope.$watch('bottomAxe', function () {
                    if (scope.bottomAxe !== undefined && scope.bottomAxe !== '') {
                        controller.bottomAxe = JSON.parse(scope.bottomAxe);
                        if (isReady()) {
                            createChart();
                        }
                    }
                });

                scope.$watch('leftAxe', function () {
                    if (scope.leftAxe !== undefined && scope.leftAxe !== '') {
                        controller.leftAxe = JSON.parse(scope.leftAxe);
                        if (isReady()) {
                            createChart();
                        }
                    }
                });

                function isReady() {
                    var result = false;
                    if (controller.chartid !== undefined && controller.chartid !== '' &&
                        controller.data !== undefined && controller.data !== '' &&
                        controller.bottomAxe !== undefined && controller.bottomAxe !== '' &&
                        controller.leftAxe !== undefined && controller.leftAxe !== ''
                    ) {
                        result = true;
                    }
                    return result;
                }

                function createChart() {
                    var delay = 0;
                    $timeout(function () {
                        controller.createChart();
                    }, delay);
                }
            }
        };
    }
})();
