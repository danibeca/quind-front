/* jshint -W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.applications')
        .controller('ApplicationsController', ApplicationsController);

    /* @ngInject */
    function ApplicationsController(componentService, ciServerService, spinnerService, storageService, $state) {
        var vm = this;

        vm.croot = storageService.getJsonObject('croot');

        vm.hasCIS = true;
        vm.applications = [];
        vm.applicationsForCI = [];
        vm.allApplications = [];
        vm.indIds = '44,52,57';

        vm.viewMore = viewMore;

        activate();

        function activate() {
            loadCIServerInstances();
            loadApplications();
        }

        function loadApplications() {
            var requestData = {
                parent_id: vm.croot.id,
                only_leaves: true
            };

            componentService.getList(requestData)
                .then(success)
                .catch(fail);

            function success(apps) {
                spinnerService.hide('appSpinner');
                vm.allApplications = [];
                apps.forEach(function(app) {
                    vm.allApplications.push(buildApplicationForTable(app));
                    vm.applications.push(buildApplicationForTable(app));
                    vm.applicationsForCI.push(buildApplicationForTable(app));
                });
                loadQAIndicators(apps);
                loadCIIndicators(apps);
            }

            function fail(error) {
                vm.msgError = error.msgCode;
            }
        }

        function loadCIServerInstances() {
            ciServerService.getInstances({component_id: vm.croot.id})
                .then(successCIServerInstances)
                .catch(failCIServerInstances);

            function successCIServerInstances(data) {
                vm.ciServerInstances = data;
                if (data.length > 0) {
                    vm.hasCIS = true;
                }
            }

            function failCIServerInstances() {
                loadApplications();
                vm.hasCIS = false;
            }
        }

        function loadQAIndicators(apps) {
            var remainingApplications = apps.length;
            apps.forEach(function (application) {
                componentService.getQAIndicators(application.id, vm.indIds)
                    .then(successQAIndicators)
                    .catch(failQAIndicators);

                function successQAIndicators(indicators) {
                    updateApplicationsTable(application, indicators, 'qa');
                    updateApplicationForChart(vm.applications, application, indicators, false);
                }

                function failQAIndicators(error) {
                    updateApplicationForChart(vm.applications, application, [], true);
                    vm.msgError = error.msgCode;
                }
            });
        }

        function loadCIIndicators(apps) {
            apps.forEach(function (application) {
                componentService.getCIIndicators(application.id, '1')
                    .then(successCIIndicators)
                    .catch(failCIIndicators);

                function successCIIndicators(indicators) {
                    if (indicators !== null && indicators !== undefined && indicators.length > 0) {
                        updateApplicationsTable(application, indicators, 'ci');
                        updateApplicationForChart(vm.applicationsForCI, application, indicators, false);
                    } else {
                        updateApplicationForChart(vm.applicationsForCI, application, [], true);
                    }
                }

                function failCIIndicators(error) {
                    buildApplicationForChart(vm.applicationsForCI, application, [], true);
                    vm.msgError = error.msgCode;
                }
            });
        }

        function buildApplicationForTable(application) {
            var appForTable = JSON.parse(JSON.stringify(application));
            return appForTable;
        }

        function updateApplicationForChart(applicationsList, application, indicators, error) {
            applicationsList.forEach(function (x) {
                if (x.id === application.id) {
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

        function updateApplicationsTable(application, indicators, indicatorsType) {
            vm.allApplications.forEach(function (x) {
                if (x.id === application.id) {
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
            $state.go('component', {componentId: component.id, newPreviousRoute: 'applications'});
        }
    }
}());
