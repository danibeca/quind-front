(function () {
    'use strict';

    angular
        .module('app.systems')
        .controller('SystemsController', SystemsController);

    /* @ngInject */
    function SystemsController(userService, storageService, systemsService, spinnerService) {
        var vm = this;
        vm.user = userService.getUser();
        vm.lang = storageService.get('lang');
        vm.vars = {
            0: 'value',
            1: 'date'
        };
        vm.systems = [];

        activate();

        function activate() {
            systemsService.getAllSystems()
                .then(success)
                .catch(fail);

            function success(systems) {
                var remainingSystems = systems.length;
                systems.forEach(function (system) {

                    systemsService.getIndicators(system.id)
                        .then(successIndicators)
                        .catch(failIndicators);

                    function successIndicators(indicators) {
                        var auxSystem = [];
                        auxSystem.name = system.name;
                        auxSystem.chartId = 'gaugeChart' + remainingSystems;
                        auxSystem.data = indicators;
                        remainingSystems--;
                        var remainingIndicators = indicators.length;
                        var ids = [];
                        var labels = [];
                        var dSeries = [];
                        indicators.forEach(function (indicator) {
                            systemsService.getIndicatorSeries(system.id, indicator.id)
                                .then(successSeries)
                                .catch(failSeries);

                            function successSeries(series) {
                                remainingIndicators--;

                                ids.push(indicator.id);
                                labels[indicator.id] = {
                                    'title': indicator.name
                                };
                                dSeries[indicator.id] = series;

                                if (remainingIndicators === 0) {
                                    createSystemCharts();
                                }
                            }

                            function failSeries(error) {
                                auxSystem.seriesError = true;
                                vm.msgError = error['msgCode'];
                            }
                        });

                        function createSystemCharts() {
                            auxSystem.ids = ids;
                            auxSystem.labels = labels;
                            auxSystem.series = dSeries;
                            vm.systems.push(auxSystem);
                            spinnerService.hide('systemsSpinner');
                        }
                    }

                    function failIndicators(error) {
                        var auxSystem = [];
                        auxSystem.name = system.name;
                        auxSystem.chartId = 'gCError' + remainingSystems;
                        auxSystem.error = true;
                        auxSystem.seriesError = true;
                        vm.systems.push(auxSystem);
                        vm.msgError = error['msgCode'];
                    }

                });
            }

            function fail(error) {
                vm.msgError = error['msgCode'];
            }
        }
    }
})();
