(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController(Restangular) {
        /*jshint unused:false*/
        var vm = this;

        Restangular.all('users').getList().then(function(users) {
            vm.percents = users[0].id;
            vm.linedata =  [
                {
                    date: '10-03-2004',
                    value: 0.21
                },
                {
                    date: '10-04-2005',
                    value: -0.80
                }
            ];

        });


    }
})();
