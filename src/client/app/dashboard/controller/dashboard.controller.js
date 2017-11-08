/* jshint -W117, -W106  */
// jscs:disable
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController(userService, componentService, ciServerService, $filter, storageService, $timeout) {
        var vm = this;
        var croot = storageService.getJsonObject('croot');

        vm.user = userService.getUser();

        vm.hasCIS = false;
        vm.chartId = 'dashChart1';
        vm.lang = storageService.get('lang');
        vm.indIds = '44,52,57';
        vm.vars = {
            0: 'value',
            1: 'date'
        };

        activate();

        function activate() {
            loadCIServerInstances();
            loadComponentsInfo();
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
                    loadCIIndicators();
                }
            }

            function failCIServerInstances() {
                vm.hasCIS = false;
            }
        }

        function loadComponentsInfo() {
            componentService.getInfo(croot.id)
                .then(successInfo)
                .catch(failInfo);

            function successInfo(info) {
                vm.info = info;
            }

            function failInfo(error) {
                vm.errorInfo = error;
            }
        }

        function loadQAAttributes() {
            componentService.getQAAttributes(croot.id)
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
            componentService.getQAIndicators(croot.id, vm.indIds)
                .then(successQAIndicators)
                .catch(failQAIndicators);

            function successQAIndicators(indicators) {
                vm.data = indicators;
                loadQAIndicatorSeries(indicators);
            }

            function failQAIndicators(error) {
                vm.error = true;
                vm.seriesError = true;
                vm.msgError = error.msgCode;
            }
        }

        function loadCIIndicators() {
            if (vm.hasCIS) {
                componentService.getCIIndicators(croot.id, '1')
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

        function loadQAIndicatorSeries(indicators) {
            var missing = indicators.length;
            var ids = [];
            var labels = [];
            var dSeries = [];

            componentService.getQAIndicatorSeries(croot.id, vm.indIds)
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

        function loadCIIndicatorSeries(indicators) {
            var missing = indicators.length;
            var ids = [];
            var labels = [];
            var dSeries = [];

            componentService.getCIIndicatorSeries(croot.id, '1')
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
    }
})();
