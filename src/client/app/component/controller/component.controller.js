/**
 * @author jmruiz6
 * created on 10.28.2017
 */
/* jshint -W101,-W106, -W117, -W071 */
// jscs:disable
(function () {
    'use strict';

    angular.module('app.component')
        .controller('ComponentController', ComponentController);

    /* @ngInject */
    function ComponentController(componentService, ciServerService, storageService, $timeout, $filter, $stateParams, spinnerService, $state) {
        var vm = this;
        var croot = storageService.getJsonObject('croot');

        vm.componentId = $stateParams.componentId;
        vm.previousRoute = $stateParams.newPreviousRoute;
        vm.previousIsComponent = $stateParams.isComponent;
        vm.previousComponentId = $stateParams.previousComponentId;
        vm.oldPreviousRoute = $stateParams.oldPreviousRoute;

        vm.pageTitle = '';

        vm.component = {};
        vm.componentApplications = [];

        vm.indIds = '44,52,57';
        vm.vars = {
            0: 'value',
            1: 'date'
        };
        vm.lang = storageService.get('lang');
        vm.dashChartId = 'dashChart1';
        var ids = [];
        var labels = [];
        var dSeries = [];
        vm.cylinderChartData = [];
        vm.hasCIPhases = false;
        vm.ciPhases = [];
        vm.applicationJobs = [];

        vm.viewMore = viewMore;
        vm.goBackFunction = goBackFunction;
        vm.appHasJob = appHasJob;

        activate();

        function activate() {
            loadComponent();
        }

        function loadComponent() {
            componentService.getOne(vm.componentId)
                .then(success)
                .catch(fail);

            function success(componentData) {
                vm.component = componentData;
                spinnerService.hide('componentSpinner');
                loadQAAttributes();
                loadQAIndicators();
                loadCIServerInstances();
                if (vm.component.tag_id === 2) {
                    vm.pageTitle = $filter('translate')('SYSTEM_TITLE') + ' ' + vm.component.name;
                    loadApplications();
                } else {
                    vm.pageTitle = $filter('translate')('APPLICATION_TITLE') + ' ' + vm.component.name;
                }
            }

            function fail(error) {
                vm.msgError = error.msgCode;
            }
        }

        function loadApplications() {
            var requestData = {
                parent_id: vm.component.id,
                only_leaves: true
            };

            componentService.getList(requestData)
                .then(success)
                .catch(fail);

            function success(apps) {
                apps.forEach(function(app) {
                    vm.componentApplications.push(buildApplicationForTable(app));
                });
                loadQAIndicatorsForApps(apps);
                loadCIIndicatorsForApps(apps);
            }

            function fail(error) {
                vm.msgError = error.msgCode;
            }
        }

        function loadQAIndicatorsForApps(apps) {
            apps.forEach(function (application) {
                componentService.getQAIndicators(application.id, vm.indIds)
                    .then(successQAIndicators)
                    .catch(failQAIndicators);

                function successQAIndicators(indicators) {
                    updateApplicationsTable(application, indicators, 'qa');
                }

                function failQAIndicators(error) {
                    vm.msgError = error.msgCode;
                }
            });
        }

        function loadCIIndicatorsForApps(apps) {
            if (vm.hasCIS) {
                apps.forEach(function (application) {
                    componentService.getCIIndicators(application.id, '1')
                        .then(successCIIndicators)
                        .catch(failCIIndicators);

                    function successCIIndicators(indicators) {
                        if (indicators !== null && indicators !== undefined && indicators.length > 0) {
                            updateApplicationsTable(application, indicators, 'ci');
                        }
                    }

                    function failCIIndicators(error) {
                        vm.msgError = error.msgCode;
                    }
                });
            }
        }

        function buildApplicationForTable(application) {
            var appForTable = JSON.parse(JSON.stringify(application));
            return appForTable;
        }

        function updateApplicationsTable(application, indicators, indicatorsType) {
            vm.componentApplications.forEach(function (x) {
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

        function loadCIServerInstances() {
            ciServerService.getInstances({component_id: croot.id})
                .then(successCIServerInstances)
                .catch(failCIServerInstances);

            function successCIServerInstances(data) {
                vm.ciServerInstances = data;
                if (data.length > 0) {
                    vm.hasCIS = true;
                    loadCIAutomationPhases();
                    loadCIIndicators();
                    if(vm.component.tag_id === 3) {
                        loadCIPhases();
                    }
                }
            }

            function failCIServerInstances() {
                vm.hasCIS = false;
            }
        }

        function loadQAAttributes() {
            componentService.getQAAttributes(vm.component.id)
                .then(successQAAttributes)
                .catch(failQAAttributes);

            function successQAAttributes(qa) {
                vm.qaData = qa;
                var delay = 1;
                $timeout(function () {
                    bubblesQA(vm.qaData);
                }, delay);
            }

            function failQAAttributes(error) {
                vm.errorQAAttributes = error;
            }
        }

        function loadCIIndicators() {
            if (vm.hasCIS) {
                componentService.getCIIndicators(vm.component.id, '1')
                    .then(successCIIndicators)
                    .catch(failCIIndicators);
            }

            function successCIIndicators(indicators) {
                vm.ciData = indicators;
                loadCIIndicatorSeries(indicators);
            }

            function failCIIndicators(error) {
                console.log(error);
                vm.ciIndicatorsError = true;
                vm.ciSeriesError = true;
            }
        }

        function loadCIIndicatorSeries(indicators) {
            var missing = indicators.length;
            var ids = [];
            var labels = [];
            var dSeries = [];

            componentService.getCIIndicatorSeries(vm.component.id, '1')
                .then(successCISeries)
                .catch(failCISeries);

            function successCISeries(indi) {
                indicators.forEach(function (name) {
                    indi.forEach(function (indicator) {
                        if (indicator[name.id] !== undefined) {
                            missing--;
                            ids.push(name.id);
                            labels[name.id] = {
                                'title': name.name
                            };
                            dSeries[name.id] = indicator[name.id];

                            if (missing === 0) {
                                createRunChart();
                            }
                        }
                    });
                });
            }

            function failCISeries(error) {
                console.log(error);
                vm.ciSeriesError = true;
            }

            function createRunChart() {
                vm.ciIds = ids;
                vm.ciLabels = labels;
                vm.ciSeries = dSeries;
            }
        }

        function loadCIAutomationPhases() {
            componentService.getCIAutomationPhases(vm.component.id)
                .then(successCIAutomationPhases)
                .catch(failCIAutomationPhases);

            function successCIAutomationPhases(phases) {
                if(phases !== null && phases !== undefined && phases.length > 0) {
                    vm.hasAutPhasesData = true;
                    prepareCylinderData(phases);
                }
            }

            function failCIAutomationPhases(error) {
                vm.errorAutPhases = error;
            }
        }

        function loadCIPhases() {
            ciServerService.getPhases({component_owner_id: croot.id})
                .then(successCIPhases);

            function successCIPhases(data) {
                vm.ciPhases = data;
                if (vm.ciPhases.length > 0) {
                    loadApplicationJobs();
                    vm.hasCIPhases = true;
                }
            }
        }

        function loadApplicationJobs() {
            ciServerService.getComponentJobs(vm.component)
                .then(successApplicationJobs)
                .catch(failApplicationJobs);

            function successApplicationJobs(data) {
                vm.applicationJobs = data;
            }

            function failApplicationJobs(error) {
                console.log(error);
            }
        }

        function appHasJob(job) {
            var jobFound = $.grep(vm.applicationJobs, function(e) { return e.id === job.id; })[0];
            if (jobFound !== undefined && jobFound !== null) {
                return true;
            }
            return false;
        }

        function buildAxe(title) {
            var labelsArray = [[0, ''],
                [1, $filter('translate')('TOO_LOW_TEXT')],
                [2, $filter('translate')('LOW_TEXT')],
                [3, $filter('translate')('MEDIUM_TEXT')],
                [4, $filter('translate')('HIGH_TEXT')],
                [5, $filter('translate')('TOO_HIGH_TEXT')]];
            var axe = {};
            axe.title = title;
            axe.labels = labelsArray;
            return axe;
        }

        function bubblesQA(data) {
            vm.qaData = data;
            vm.qaConfig = {};
            vm.qaConfig.bottomAxe = buildAxe($filter('translate')('EFFORT_TEXT'));
            vm.qaConfig.leftAxe = buildAxe($filter('translate')('CRITICITY_TEXT'));
            vm.qaConfig.bullet = 'circle';
            vm.qaConfig.lineAlpha = 0;
            vm.qaConfig.fillAlphas = 0;
            vm.qaConfig.maxBulletSize = 80;
            vm.qaConfig.minBulletSize = 15;
            vm.qaConfig.bulletBorderAlpha = 1;
            vm.qaConfig.bulletBorderThickness = 2;
            vm.qaConfig.bulletAlpha = 0.8;
        }

        function loadQAIndicators() {
            componentService.getQAIndicators(vm.component.id, vm.indIds)
                .then(successIndicators)
                .catch(failIndicators);

            function successIndicators(indicators) {
                vm.data = indicators;
                prepareRunChart(indicators);
            }

            function failIndicators(error) {
                vm.error = true;
                vm.seriesError = true;
                vm.msgError = error.msgCode;
            }
        }

        function prepareCylinderData(indicators) {
            indicators.forEach(function(x) {
                var cylinderDataAux = {};
                cylinderDataAux.name = x.phase;
                cylinderDataAux.values = [];
                cylinderDataAux.values.push(x.value);
                vm.cylinderChartData.push(cylinderDataAux);
            });
        }

        function prepareRunChart(indicators) {
            var missing = indicators.length;
            componentService.getQAIndicatorSeries(vm.component.id, vm.indIds)
                .then(successSeries);

            function successSeries(indi) {
                indicators.forEach(function (name) {
                    indi.forEach(function (indicator) {
                        if (indicator[name.id] !== undefined) {
                            missing--;
                            ids.push(name.id);
                            labels[name.id] = {
                                'title': name.name
                            };
                            dSeries[name.id] = indicator[name.id];

                            if (missing === 0) {
                                createRunChart();
                            }
                        }
                    });
                });
            }

            function createRunChart() {
                vm.ids = ids;
                vm.labels = labels;
                vm.series = dSeries;
            }
        }

        function viewMore(component) {
            $state.go('component', {componentId: component.id,
                                    newPreviousRoute: 'component',
                                    isComponent: true,
                                    previousComponentId: vm.component.id,
                                    oldPreviousRoute: vm.previousRoute});
        }
        
        function goBackFunction() {
            if (vm.previousIsComponent) {
                $state.go('component', {componentId: vm.previousComponentId,
                                        newPreviousRoute: vm.oldPreviousRoute,
                                        isComponent: false,
                                        previousComponentId: vm.component.id});
            } else {
                $state.go(vm.previousRoute);
            }
        }
    }
})();
