(function () {
    'use strict';

    angular
        .module('app.applications')
        .controller('ApplicationsController', ApplicationsController);

    /* @ngInject */
    function ApplicationsController(Restangular, spinnerService) {
        /*jshint unused:false*/
        var vm = this;

        Restangular.all('applications').getList().then(function (applications) {
            var apps = applications.plain();
            vm.applications = [];

            apps.forEach(function (application) {
                Restangular.one('applications', application.id)
                    .one('indicators', 1)
                    .get().then(function (indicator) {
                    application.percent = indicator.data.value;
                    vm.applications.push(application);
                    spinnerService.hide('systemsSpinner');
                });
            });
        });
    }
})();
