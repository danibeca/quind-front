(function () {
    'use strict';

    angular
        .module('app.systems')
        .controller('SystemsController', SystemsController);

    /* @ngInject */
    function SystemsController(Restangular, user, $scope, $timeout, spinnerService) {
        /*jshint unused:false*/
        var vm = this;

        Restangular.all('systems').getList().then(function (systems) {
            var sys = systems.plain();
            vm.systems = [];

            sys.forEach(function (system) {
                Restangular.one('systems', system.id)
                    .one('indicators', 1)
                    .get().then(function (indicator) {
                    system.percent = indicator.data.value;
                    system.indicatorName = indicator.data.name.toUpperCase();

                    Restangular.one('systems', system.id)
                        .one('indicators', 1)
                        .getList('series').then(function (series) {
                        system.linedata = series.plain();
                        vm.systems.push(system);
                        spinnerService.hide('systemsSpinner');
                    });

                });
            });
        });
    }
})();
