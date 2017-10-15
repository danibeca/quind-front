/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController($timeout,userService, accountService, storageService) {
        var vm = this;
        vm.user = userService.getUser();
        vm.chartId = 'dashChart1';
        vm.lang = storageService.get('lang');
        vm.vars = {
            0: 'value',
            1: 'date'
        };

        var ids = [];
        var labels = [];
        var dSeries = [];

        activate();

        function activate() {

            accountService.getInfo(vm.user.accountId)
                .then(successInfo)
                .catch(failInfo);

            function successInfo(info) {
                vm.info = info[0];

            }

            function failInfo(error) {
                vm.errorInfo = error;
            }

            accountService.getQA(vm.user.accountId)
                .then(successQA)
                .catch(failQA);

            accountService.getIndicators(vm.user.accountId)
                .then(success)
                .catch(fail);


            function success(indicators) {
                vm.data = indicators;
                var missing = indicators.length;
                indicators.forEach(function (indicator) {
                    accountService.getIndicatorSeries(vm.user.accountId, indicator.id)
                        .then(successSeries)
                        .catch(failSeries);

                    function successSeries(series) {
                        missing--;
                        ids.push(indicator.id);
                        labels[indicator.id] = {
                            'title': indicator.name
                        };
                        dSeries[indicator.id] = series;

                        if (missing === 0) {
                            createRunChart();
                        }
                    }

                    function failSeries(error) {
                        vm.seriesError = true;
                        vm.msgError = error['msgCode'];
                    }
                });


                function createRunChart() {
                    vm.ids = ids;
                    vm.labels = labels;
                    vm.series = dSeries;

                }
            }

            function successQA(qa) {
                vm.qa = qa;
                var delay = 1000;
                $timeout(function () {
                    bubbles();
                }, delay);

            }

            function fail(error) {
                vm.error = true;
                vm.seriesError = true;
                vm.msgError = error['msgCode'];
            }


            function failQA(error) {
                vm.errorQA = error;
            }

            function bubbles() {

                AmCharts.makeChart('qagraph', {
                    'type': 'xy',
                    'theme': 'light',
                    'legend': {
                        'horizontalGap': 10,
                        'maxColumns': 1,
                        'position': 'right',
                        'markerType': 'circle'

                    },
                    'dataProvider': vm.qa[1],
                    'valueAxes': [{
                        'position': 'bottom',
                        'title': 'Esfuerzo',
                        'minimum': 0,
                        'maximum': 5,
                        'strictMinMax': true,
                        'labelFunction': function (value) {
                            if (value === 1) {
                                return 'Muy bajo';
                            }
                            if (value === 2) {
                                return 'Bajo';
                            }
                            if (value === 3) {
                                return 'Medio';
                            }
                            if (value === 4) {
                                return 'Alto';
                            }

                            if (value === 5) {
                                return 'Muy alto';
                            }
                            return '';
                        }

                    }, {

                        'axisAlpha': 0,
                        'position': 'left',
                        'title': 'Criticidad',
                        'minimum': 0,
                        'maximum': 5,
                        'strictMinMax': true,
                        'minMaxMultiplier': 1.5,
                        'labelFunction': function (value) {
                            if (value === 1) {
                                return 'Muy bajo';
                            }
                            if (value === 2) {
                                return 'Bajo';
                            }
                            if (value === 3) {
                                return 'Medio';
                            }
                            if (value === 4) {
                                return 'Alto';
                            }

                            if (value === 5) {
                                return 'Muy alto';
                            }
                            return '';
                        }
                    }],
                    'startDuration': 1.5,
                    'graphs': vm.qa[0],
                    'responsive': {
                        'enabled': true
                    }

                });

            }
        }
    }
})();
