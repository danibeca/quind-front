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
    function ComponentDashboardCtrl(componentService, storageService, $timeout, $filter) {
        var vm = this;

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
            componentService.getInfo(vm.component.id)
                .then(successInfo)
                .catch(failInfo);

            function successInfo(info) {
                vm.info = info;

            }

            function failInfo(error) {
                vm.errorInfo = error;
            }

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

            componentService.getIndicators(vm.component.id, vm.indIds)
                .then(success)
                .catch(fail);

            function success(indicators) {
                vm.data = indicators;
                var missing = indicators.length;
                componentService.getIndicatorSeries(vm.component.id, vm.indIds)
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

            function fail(error) {
                vm.error = true;
                vm.seriesError = true;
                vm.msgError = error.msgCode;
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
        }
    }
})();
