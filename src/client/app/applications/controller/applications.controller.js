(function () {
    'use strict';

    angular
        .module('app.applications')
        .controller('ApplicationsController', ApplicationsController);

    /* @ngInject */
    function ApplicationsController(componentService, spinnerService, storageService) {
        var vm = this;
        vm.applications = [];
        vm.indIds = '44,52,57';
        activate();

        function activate() {
            var requestData = {
                parent_id: storageService.getJsonObject('croot').id,
                only_leaves: true
            };

            componentService.getList(requestData)
                .then(success)
                .catch(fail);

            function success(apps) {
                var remainingApplications = apps.length;
                apps.forEach(function (application) {
                    componentService.getIndicators(application.id, vm.indIds)
                        .then(successIndicators)
                        .catch(failIndicators);

                    function successIndicators(indicators) {
                        spinnerService.hide('appSpinner');
                        var auxApplication = [];
                        auxApplication.name = application.name;
                        auxApplication.chartId = 'gaugeChart' + remainingApplications;
                        auxApplication.data = indicators;
                        remainingApplications--;
                        vm.applications.push(auxApplication);

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
