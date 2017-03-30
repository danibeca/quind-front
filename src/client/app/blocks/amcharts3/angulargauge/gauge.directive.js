/**
 * @author Daniel Betancur <danibeca@okazo.co>
 * created on 02.22.2017
 */
(function () {
    'use strict';

    angular.module('blocks.amcharts3')
        .directive('gaugeChart', gaugeChart);

    /* @ngInject */
    function gaugeChart($timeout, spinnerService) {
        return {
            restrict: 'E',
            controller: 'GaugeChartCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/amcharts3/angulargauge/gauge.template.html',
            scope: {
                chartid: '@',
                data: '@',
                loading: '@',
                error: '@'
            },
            link: function (scope, element, attrs, controller) {
                scope.$watch('error', function () {
                    if (scope.error === 'true') {
                        spinnerService.hide(controller.spinner);
                    }
                });
                scope.$watch('loading', function () {
                    if (scope.loading !== undefined && scope.loading !== '') {
                        controller.loading = scope.loading;
                    }
                });
                scope.$watch('chartid', function () {
                    if (scope.chartid !== undefined && scope.chartid !== '') {
                        controller.id = scope.chartid;
                        if (controller.data !== undefined && controller.data !== '') {
                            createChart();
                        }
                    }
                });
                scope.$watch('data', function () {
                    if (scope.data !== undefined && scope.data !== '') {
                        controller.data = JSON.parse(scope.data);
                        if (controller.id !== undefined && controller.id !== '') {
                            createChart();
                        }
                    }
                });

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
