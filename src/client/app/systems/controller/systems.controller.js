(function () {
    'use strict';

    angular
        .module('app.systems')
        .controller('SystemsController', SystemsController);

    /* @ngInject */
    function SystemsController(userService, storageService, componentService, spinnerService, $state) {
        var vm = this;

        vm.user = userService.getUser();
        vm.croot = storageService.getJsonObject('croot');
        vm.indIds = '44,52,57';
        vm.arrayIndIds = [{id: 44, name: 'Salud Código'},
                          {id: 52, name: 'Confiabilidad'},
                          {id: 57, name: 'Potencial de eficiencia'}];
        vm.systems = [];
        vm.allSystems = [];
        vm.componentForDashboard = {};
        vm.viewComponentDashboard = false;

        vm.viewMore = viewMore;
        vm.backToList = backToList;

        activate();

        function activate() {
            var requestData = {
                parent_id: storageService.getJsonObject('croot').id,
                no_leaves: true
            };
            componentService.getList(requestData)
                .then(success)
                .catch(fail);

            function success(systems) {
                var remainingSystems = systems.length;
                systems.forEach(function (system) {

                    componentService.getIndicators(system.id, vm.indIds)
                        .then(successIndicators)
                        .catch(failIndicators);

                    function successIndicators(indicators) {
                        var systemForTable = JSON.parse(JSON.stringify(system));
                        systemForTable.codeHealth = $.grep(indicators, function(e) { return e.id === 44; })[0];
                        systemForTable.reliability = $.grep(indicators, function(e) { return e.id === 52; })[0];
                        systemForTable.efficiencyPotential = $.grep(indicators, function(e) { return e.id === 57; })[0];
                        vm.allSystems.push(systemForTable);

                        var auxSystem = {};
                        auxSystem.name = system.name;
                        auxSystem.chartId = 'gaugeChart' + remainingSystems;
                        auxSystem.data = indicators;
                        vm.systems.push(auxSystem);
                        spinnerService.hide('systemsSpinner');
                        remainingSystems--;
                    }

                    function failIndicators(error) {
                        var auxSystem = {};
                        auxSystem.name = system.name;
                        auxSystem.chartId = 'gCError' + remainingSystems;
                        auxSystem.error = true;
                        vm.systems.push(auxSystem);
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
})();
