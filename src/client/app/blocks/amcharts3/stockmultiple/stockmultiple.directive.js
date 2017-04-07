/**
 * @author Daniel Betancur <danibeca@okazo.co>
 * created on 03.29.2017
 */
(function () {
    'use strict';

    angular.module('blocks.amcharts3')
        .directive('stockMultipleChart', stockMultipleChart);

    /* @ngInject */
    function stockMultipleChart($timeout, spinnerService) {
        return {
            restrict: 'E',
            controller: 'StockMultipleChartCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/blocks/amcharts3/stockmultiple/stockmultiple.template.html',
            scope: {
                ids: '@',
                series: '@',
                labels: '@',
                vars: '@',
                lang: '@',
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

                scope.$watch('ids', function () {
                    if (scope.ids !== undefined && scope.ids !== '') {
                        controller.ids = JSON.parse(scope.ids);
                        if (isReady()) {
                            createChart();
                        }
                    }
                });

                scope.$watch('lang', function () {
                    if (scope.lang !== undefined && scope.lang !== '') {
                        controller.lang = scope.lang;
                        if (isReady()) {
                            createChart();
                        }
                    }
                });
                scope.$watch('series', function () {
                    if (scope.series !== undefined && scope.series !== '') {
                        controller.series = JSON.parse(scope.series);
                        if (isReady()) {
                            createChart();
                        }
                    }
                });

                scope.$watch('labels', function () {
                    if (scope.labels !== undefined && scope.labels !== '') {
                        controller.labels = JSON.parse(scope.labels);
                        if (isReady()) {
                            createChart();
                        }
                    }
                });

                scope.$watch('vars', function () {
                    if (scope.vars !== undefined && scope.vars !== '') {
                        controller.vars = JSON.parse(scope.vars);
                        if (isReady()) {
                            createChart();
                        }
                    }
                });

                function isReady() {
                    var result = false;
                    if (controller.ids !== undefined && controller.ids !== '' &&
                        controller.series !== undefined && controller.series !== '' &&
                        controller.labels !== undefined && controller.labels !== '' &&
                        controller.vars !== undefined && controller.vars !== '' &&
                        controller.lang !== undefined && controller.lang !== ''
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
