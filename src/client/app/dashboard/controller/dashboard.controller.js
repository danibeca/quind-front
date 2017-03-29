(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController(user, accountService, Restangular) {
        var vm = this;
        vm.user = user.getUser();
        vm.chartId = 'dashChart1';
        activate();

        function activate() {
            accountService.getIndicators(vm.user.accountId)
                .then(success)
                .catch(fail);

            function success(indicators) {
                vm.data = indicators;
            }

            function fail(error) {
                vm.error = true;
                vm.msgError = error['msgCode'];
            }

            Restangular.one('accounts', vm.user.accountId)
                .one('indicators', 1)
                .getList('series').then(function (series) {
                vm.linedata = series.plain();
                vm.indicatorName = 'Salud del Codigo';
            });
        }
    }
})();
