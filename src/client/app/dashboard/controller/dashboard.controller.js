(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController(Restangular, user) {
        /*jshint unused:false*/
        var vm = this;

        Restangular.one('accounts', user.getUser().accountId)
            .one('indicators', 1)
            .get().then(function (indicator) {
            vm.percents = indicator.data.value;
        });

        Restangular.one('accounts', user.getUser().accountId)
            .one('indicators', 1)
            .getList('series').then(function (series) {
            vm.linedata = series;
        });

    }
})();
