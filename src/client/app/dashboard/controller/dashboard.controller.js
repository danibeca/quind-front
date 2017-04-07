(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController(user, accountService, Restangular, storage) {
        var vm = this;
        vm.user = user.getUser();
        vm.chartId = 'dashChart1';
        vm.lang = storage.get('lang');
        vm.vars = {
            0: 'value',
            1: 'date'
        };

        var ids = [];
        var labels = [];
        var dSeries = [];

        activate();

        function activate() {
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

            function fail(error) {
                vm.error = true;
                vm.seriesError = true;
                vm.msgError = error['msgCode'];
            }
        }
    }
})();
