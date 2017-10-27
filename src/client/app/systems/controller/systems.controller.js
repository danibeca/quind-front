(function () {
    'use strict';

    angular
        .module('app.systems')
        .controller('SystemsController', SystemsController);

    /* @ngInject */
    function SystemsController(userService, storageService, componentService, spinnerService) {
        var vm = this;
        vm.user = userService.getUser();
        vm.lang = storageService.get('lang');
        vm.vars = {
            0: 'value',
            1: 'date'
        };
        vm.indIds = '44,52,57';
        vm.systems = [];

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
                        var auxSystem = [];
                        auxSystem.name = system.name;
                        auxSystem.chartId = 'gaugeChart' + remainingSystems;
                        auxSystem.data = indicators;

                        var remainingIndicators = indicators.length;
                        var missing = indicators.length;
                        var ids = [];
                        var labels = [];
                        var dSeries = [];

                        componentService.getIndicatorSeries(system.id, vm.indIds)
                            .then(successSeries)
                            .catch(failSeries);

                        function successSeries(series) {
                            indicators.forEach(function (name) {
                                series.forEach(function (indicator) {
                                    if (indicator[name.id] !== undefined) {
                                        missing--;
                                        ids.push(name.id);
                                        labels[name.id] = {
                                            'title': name.name
                                        };
                                        dSeries[name.id] = indicator[name.id];

                                        if (missing === 0) {
                                            createSystemCharts();
                                            remainingSystems--;
                                        }
                                    }
                                });
                            });
                        }

                        function failSeries(error) {
                            auxSystem.seriesError = true;
                            vm.msgError = error['msgCode'];
                        }


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
