(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController(Restangular, user, spinnerService) {
        /*jshint unused:false*/
        var vm = this;
        vm.account = [];
        vm.user = user.getUser();

        Restangular.one('accounts', vm.user.accountId)
            .one('indicators', 1)
            .get().then(success)
            .catch(fail);

        function success(indicator) {
            vm.percents = indicator.data.value;
        }

        function fail() {
            spinnerService.hide('html5spinnerchart1');
            vm.error = true;
        }


        Restangular.one('accounts', vm.user.accountId)
            .one('indicators', 1)
            .getList('series').then(function (series) {
            vm.linedata = series.plain();
        });

    }
})();
