(function () {
    'use strict';

    angular
        .module('app.systems')
        .controller('SystemsController', SystemsController);

    /* @ngInject */
    function SystemsController(userService, storageService, componentService, ciServerService, spinnerService, $filter) {
        var vm = this;

        vm.croot = storageService.getJsonObject('croot');

        vm.user = userService.getUser();
        vm.indIds = '44,52,57';
        vm.hasCIS = false;
        vm.systems = [];
        vm.systemsForCI = [];
        vm.allSystems = [];
        vm.componentForDashboard = {};
        vm.viewComponentDashboard = false;

        vm.viewMore = viewMore;
        vm.backToList = backToList;

        activate();

        function activate() {
            loadCIServerInstances();
        }

        function loadSystems() {
            var requestData = {
                parent_id: vm.croot.id,
                no_leaves: true
            };
            componentService.getList(requestData)
                .then(successLoadComponents)
                .catch(failLoadComponents);

            function successLoadComponents(systems) {
                loadQAIndicators(systems);
                loadCIIndicators(systems);
            }

            function failLoadComponents(error) {
                vm.msgError = error.msgCode;
            }
        }

        function loadCIServerInstances() {
            ciServerService.getInstances({component_id: vm.croot.id})
                .then(successCIServerInstances)
                .catch(failCIServerInstances);

            function successCIServerInstances(data) {
                loadSystems();
                vm.renderCIServerForm = true;
                vm.ciServerInstances = data;
                if (data.length > 0) {
                    vm.hasCIS = true;
                }
            }

            function failCIServerInstances(data) {
                loadSystems();
                vm.hasCIS = false;
            }
        }

        function loadQAIndicators(systems) {
            var remainingSystems = systems.length;
            systems.forEach(function (system) {
                componentService.getQAIndicators(system.id, vm.indIds)
                    .then(successQAIndicators)
                    .catch(failQAIndicators);

                function successQAIndicators(indicators) {
                    spinnerService.hide('systemsSpinner');
                    vm.allSystems.push(buildSystemForTable(system, indicators));
                    vm.systems.push(buildSystemForChart(system, indicators, remainingSystems, false));
                    remainingSystems--;
                }

                function failQAIndicators(error) {
                    buildSystemForChart(system, [], remainingSystems, true);
                    vm.msgError = error.msgCode;
                }
            });
        }

        function loadCIIndicators(systems) {
            if (vm.hasCIS) {
                var remainingSystems = systems.length;
                systems.forEach(function (system) {
                    componentService.getCIIndicators(system.id, '1')
                        .then(successCIIndicators)
                        .catch(failCIIndicators);

                    function successCIIndicators(indicators) {
                        if (indicators !== null && indicators !== undefined && indicators.length > 0) {
                            vm.systemsForCI.push(buildSystemForChart(system, indicators,
                                remainingSystems, false));
                        }
                        remainingSystems--;
                    }

                    function failCIIndicators(error) {
                        buildSystemForChart(system, [], remainingSystems, true);
                        vm.msgError = error.msgCode;
                    }
                });
            }
        }

        function buildSystemForTable(system, indicators) {
            var systemForTable = JSON.parse(JSON.stringify(system));
            systemForTable.codeHealth = $.grep(indicators, function(e) { return e.id === 44; })[0];
            systemForTable.reliability = $.grep(indicators, function(e) { return e.id === 52; })[0];
            systemForTable.efficiencyPotential = $.grep(indicators, function(e) { return e.id === 57; })[0];
            return systemForTable;
        }

        function buildSystemForChart(system, indicators, remainingSystems, error) {
            var auxSystem = {};
            auxSystem.name = system.name;
            if (!error) {
                auxSystem.chartId = 'gaugeChart' + remainingSystems;
                auxSystem.data = indicators;
            } else {
                auxSystem.chartId = 'gCError' + remainingSystems;
                auxSystem.error = true;
            }
            return auxSystem;
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
