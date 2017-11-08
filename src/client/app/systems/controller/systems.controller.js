/* jshint -W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.systems')
        .controller('SystemsController', SystemsController);

    /* @ngInject */
    function SystemsController(userService, storageService, componentService, ciServerService, spinnerService, $state) {
        var vm = this;

        vm.croot = storageService.getJsonObject('croot');

        vm.user = userService.getUser();
        vm.indIds = '44,52,57';
        vm.hasCIS = false;
        vm.systems = [];
        vm.systemsForCI = [];
        vm.allSystems = [];

        vm.viewMore = viewMore;

        activate();

        function activate() {
            loadSystems();
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
                spinnerService.hide('systemsSpinner');
                systems.forEach(function (system) {
                    vm.allSystems.push(buildSystemForTable(system));
                    vm.systems.push(buildSystemForTable(system));
                    vm.systemsForCI.push(buildSystemForTable(system));
                });
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
                vm.renderCIServerForm = true;
                vm.ciServerInstances = data;
                if (data.length > 0) {
                    vm.hasCIS = true;
                }
            }

            function failCIServerInstances() {
                loadSystems();
                vm.hasCIS = false;
            }
        }

        function loadQAIndicators(systems) {
            systems.forEach(function (system) {
                componentService.getQAIndicators(system.id, vm.indIds)
                    .then(successQAIndicators)
                    .catch(failQAIndicators);

                function successQAIndicators(indicators) {
                    updateSystemsTable(system, indicators, 'qa');
                    updateSystemForChart(vm.systems, system, indicators, false);
                }

                function failQAIndicators(error) {
                    updateSystemForChart(vm.systems, system, [], true);
                    vm.msgError = error.msgCode;
                }
            });
        }

        function loadCIIndicators(systems) {
            systems.forEach(function (system) {
                componentService.getCIIndicators(system.id, '1')
                    .then(successCIIndicators)
                    .catch(failCIIndicators);

                function successCIIndicators(indicators) {
                    if (indicators !== null && indicators !== undefined && indicators.length > 0) {
                        updateSystemsTable(system, indicators, 'ci');
                        updateSystemForChart(vm.systemsForCI, system, indicators, false);
                    } else {
                        buildSystemForChart(vm.systemsForCI, system, [], true);
                    }
                }

                function failCIIndicators(error) {
                    buildSystemForChart(vm.systemsForCI, system, [], true);
                    vm.msgError = error.msgCode;
                }
            });
        }

        function buildSystemForTable(system) {
            return JSON.parse(JSON.stringify(system));
        }

        function updateSystemForChart(systemsList, system, indicators, error) {
            systemsList.forEach(function (x) {
                if (x.id === system.id) {
                    if (!error) {
                        x.chartId = 'gaugeChart' + x.id;
                        x.data = indicators;
                    } else {
                        x.chartId = 'gCError' + x.id;
                        x.error = true;
                    }
                }
            });
        }

        function updateSystemsTable(system, indicators, indicatorsType) {
            vm.allSystems.forEach(function (x) {
                if (x.id === system.id) {
                    if (indicatorsType === 'qa') {
                        x.codeHealth = $.grep(indicators, function(e) { return e.id === 44; })[0];
                        x.reliability = $.grep(indicators, function(e) { return e.id === 52; })[0];
                        x.efficiencyPotential = $.grep(indicators, function(e) { return e.id === 57; })[0];
                    } else {
                        x.automation = $.grep(indicators, function(e) { return e.id === 1; })[0];
                    }
                }
            });
        }

        function viewMore(component) {
            $state.go('component', {componentId: component.id, newPreviousRoute: 'systems'});
        }
    }
})();
