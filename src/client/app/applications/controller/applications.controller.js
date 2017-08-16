(function () {
    'use strict';

    angular
        .module('app.applications')
        .controller('ApplicationsController', ApplicationsController);

    /* @ngInject */
    function ApplicationsController(appservice, spinnerService) {
        var vm = this;
        vm.applications = [];
        activate();

        function activate() {
            return appservice.getApplications()
                .then(success)
                .catch(fail);

            function success(apps) {
                var remainingApplications = apps.length;
                apps.forEach(function (application) {
                    appservice.getGeneralIndicators(application.id)
                        .then(successIndicators)
                        .catch(failIndicators);

                    function successIndicators(indicators) {
                        var auxApplication = [];
                        auxApplication.name = application.name;
                        auxApplication.chartId = 'gaugeChart' + remainingApplications;
                        auxApplication.data = indicators;
                        remainingApplications--;
                        vm.applications.push(auxApplication);
                        spinnerService.hide('appSpinner');
                    }

                    function failIndicators(error) {
                        var auxApplication = [];
                        auxApplication.name = application.name;
                        auxApplication.chartId = 'gCError' + remainingApplications;
                        auxApplication.error = true;
                        vm.applications.push(auxApplication);
                        vm.msgError = error['msgCode'];
                    }

                });
            }

            function fail(error) {
                vm.msgError = error['msgCode'];
            }
        }
    }
}());
