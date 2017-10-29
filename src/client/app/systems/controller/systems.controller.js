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
        vm.lang = storageService.get('lang');
        vm.vars = {
            0: 'value',
            1: 'date'
        };
        vm.orderOptionsCriticals = [{id: 1, name: 'Críticos en Salud código'},
                                    {id: 2, name: 'Críticos en Confiabilidad'},
                                    {id: 3, name: 'Críticos en Potencial de eficiencia'}];
        vm.orderOptionsOutstanding = [{id: 1, name: 'Destacados en Salud código'},
                                      {id: 2, name: 'Destacados en Confiabilidad'},
                                      {id: 3, name: 'Destacados en Potencial de eficiencia'}];
        vm.orderOne = 0;
        vm.orderTwo = 0;
        vm.indIds = '44,52,57';
        vm.systems = [];
        vm.allSystems = [];
        vm.componentForDashboard = {};
        vm.viewComponentDashboard = false;

        vm.viewMore = viewMore;
        vm.backToList = backToList;
        vm.orderSystemsByCriticals = orderSystemsByCriticals;
        vm.orderSystemsByOutstanding = orderSystemsByOutstanding;

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

                        var auxSystem = [];
                        auxSystem.name = system.name;
                        auxSystem.chartId = 'gaugeChart' + remainingSystems;
                        auxSystem.data = indicators;
                        vm.systems.push(auxSystem);
                        spinnerService.hide('systemsSpinner');
                        remainingSystems--;
                    }

                    function failIndicators(error) {
                        var auxSystem = [];
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

        function orderSystemsByCriticals() {
            vm.orderTwo = 0;
            switch (vm.orderOne) {
                case 1:
                    vm.systems.sort(function(a, b) {return compare(false, 44, a, b);});
                    break;
                case 2:
                    vm.systems.sort(function(a, b) {return compare(false, 52, a, b);});
                    break;
                case 3:
                    vm.systems.sort(function(a, b) {return compare(false, 57, a, b);});
                    break;
            }
        }

        function orderSystemsByOutstanding() {
            vm.orderOne = 0;
            switch (vm.orderTwo) {
                case 1:
                    vm.systems.sort(function(a, b) {return compare(true, 44, a, b);});
                    break;
                case 2:
                    vm.systems.sort(function(a, b) {return compare(true, 52, a, b);});
                    break;
                case 3:
                    vm.systems.sort(function(a, b) {return compare(true, 57, a, b);});
                    break;
            }
        }

        function compare(inverse, id, a, b) {
            var valueA = $.grep(a.data, function(e) { return e.id === id; })[0].value;
            var valueB = $.grep(b.data, function(e) { return e.id === id; })[0].value;
            if (inverse) {
                return parseFloat(valueB) - parseFloat(valueA);
            } else {
                return parseFloat(valueA) - parseFloat(valueB);
            }
        }
    }
})();
