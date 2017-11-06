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
                vm.allApplications = [];
                apps.forEach(function(app) {
                    vm.allApplications.push(buildApplicationForTable(app));
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
                loadApplications();
                vm.ciServerInstances = data;
                if (data.length > 0) {
                    vm.hasCIS = true;
                }
            }

            function failCIServerInstances(data) {
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
                    spinnerService.hide('appSpinner');
                    updateApplicationsTable(application, indicators, 'qa');
                    vm.applications.push(buildApplicationForChart(application, indicators,
                        remainingApplications, false));
                    remainingApplications--;
                }

                function failQAIndicators(error) {
                    buildApplicationForChart(application, [], remainingApplications, true);
                    vm.msgError = error.msgCode;
                }
            });
        }

        function loadCIIndicators(apps) {
            if (vm.hasCIS) {
                var remainingApplications = apps.length;
                apps.forEach(function (application) {
                    componentService.getCIIndicators(application.id, '1')
                        .then(successCIIndicators)
                        .catch(failCIIndicators);

                    function successCIIndicators(indicators) {
                        if (indicators !== null && indicators !== undefined && indicators.length > 0) {
                            updateApplicationsTable(application, indicators, 'ci');
                            vm.applicationsForCI.push(buildApplicationForChart(application, indicators,
                                remainingApplications, false));
                        }
                        remainingApplications--;
                    }

                    function failCIIndicators(error) {
                        buildApplicationForChart(application, [], remainingApplications, true);
                        vm.msgError = error.msgCode;
                    }
                });
            }
        }

        function buildApplicationForTable(application) {
            var appForTable = JSON.parse(JSON.stringify(application));
            return appForTable;
        }

        function buildApplicationForChart(application, indicators, remainingApplications, error) {
            var auxApp = {};
            auxApp.name = application.name;
            if (!error) {
                auxApp.chartId = 'gaugeChart' + remainingApplications;
                auxApp.data = indicators;
            } else {
                auxApp.chartId = 'gCError' + remainingApplications;
                auxApp.error = true;
            }
            return auxApp;
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
