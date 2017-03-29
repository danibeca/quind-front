(function () {
    'use strict';

    angular
        .module('app.applications')
        .controller('ApplicationsController', ApplicationsController);

    /* @ngInject */
    function ApplicationsController(appservice, spinnerService, logger, $filter) {
        /*jshint unused:false*/
        var vm = this;
        vm.applications = [];
        activate();

        function activate() {
            return appservice.getApplications()
                .then(success)
                .catch(fail);


            function success(apps) {
                apps.forEach(function (application) {
                    var indiccatorId = 44;
                    appservice.getIndicator(application.id, indiccatorId).then(function (indicator) {
                        application.percent = indicator.value;
                        application.indicatorName = indicator.name.toUpperCase();
                        vm.applications.push(application);
                        spinnerService.hide('appSpinner');
                    });
                });
            }

            function fail(error) {
                spinnerService.hide('appSpinner');
                logger.error($filter('translate')(error['msgCode']));
            }
        }
    }
}());
