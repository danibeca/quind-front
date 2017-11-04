/**
 * @author jmruiz6
 * created on 10.28.2017
 */
/* jshint -W101,-W106, -W117 */
// jscs:disable
(function () {
    'use strict';

    angular.module('blocks.theme.components')
        .controller('ComponentDashboardCtrl', ComponentDashboardCtrl);

    /* @ngInject */
    function ComponentDashboardCtrl(componentService, ciServerService, storageService, $timeout, $filter) {
        var vm = this;

        var croot = storageService.getJsonObject('croot');

        vm.component = {};
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

        vm.setComponent = setComponent;

        /*************************************
            Methods to set data from directive
         *************************************/
        function setComponent(component) {
            vm.component = component;
            activate();
        }

        /*********************************************
         Methods to load data from remote services
         ********************************************/
        function activate() {
            loadCIServerInstances();
            loadQAAttributes();
            loadQAIndicators();
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
                }
            }

            function failCIServerInstances(data) {
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
                console.log(error)
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
                console.log(error)
                vm.errorAutPhases = error;
            }
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
    }
})();
