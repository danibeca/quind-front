(function () {
    'use strict';

    angular
        .module('app.applications')
        .controller('ApplicationsController', ApplicationsController);

    /* @ngInject */
    function ApplicationsController(componentService, spinnerService, storageService, $state) {
        var vm = this;

        vm.croot = storageService.getJsonObject('croot');
        vm.applications = [];
        vm.allApplications = [];
        vm.componentForDashboard = {};
        vm.viewComponentDashboard = false;
        vm.indIds = '44,52,57';
        vm.arrayIndIds = [{id: 44, name: 'Salud Código'},
                          {id: 52, name: 'Confiabilidad'},
                          {id: 57, name: 'Potencial de eficiencia'}];

        vm.viewMore = viewMore;
        vm.backToList = backToList;

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
                        var applicationForTable = JSON.parse(JSON.stringify(application));
                        applicationForTable.codeHealth = $.grep(indicators, function(e) { return e.id === 44; })[0];
                        applicationForTable.reliability = $.grep(indicators, function(e) { return e.id === 52; })[0];
                        applicationForTable.efficiencyPotential = $.grep(indicators, function(e) { return e.id === 57; })[0];
                        vm.allApplications.push(applicationForTable);
                        var auxApplication = {};
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

        function viewMore(component) {
            vm.componentForDashboard = component;
            vm.viewComponentDashboard = true;
        }

        function backToList() {
            vm.viewComponentDashboard = false;
        }
    }
}());
