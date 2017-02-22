(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController(Restangular, user) {
        /*jshint unused:false*/
        var vm = this;

        Restangular.one('accounts', user.getUser().account_id).one('indicators', 1).get().then(function(indicator) {
            vm.percents = indicator.data.value;
            /*vm.linedata =  [
                {
                    date: '10-03-2004',
                    value: 0.21
                },
                {
                    date: '10-04-2005',
                    value: -0.80
                }
            ];*/

        });

        Restangular.one('accounts', user.getUser().account_id).one('indicators', 1).getList('series').then(function(series) {
                //alert(JSON.stringify(series));
            vm.linedata = series;
        });
    }
})();
